import { createClient } from '@/lib/supabase/server';
import mockDemographics from '@/data/mock/demographics.json';
import mockVillageInfo from '@/data/mock/village-info.json';

export interface DemographicData {
  population: { total: number; households: number; male: number; female: number };
  hamlets: { name: string; value: number }[];
  occupations: { label: string; value: number }[];
  education: { label: string; value: number }[];
  marital_status: { label: string; value: number }[];
  family_relationship: { label: string; value: number }[];
  age_groups: { label: string; value: number }[];
}

export interface VillageImage {
  url: string; title: string; source: 'post' | 'branding'; date: string; link?: string;
}

export async function getDemographics(): Promise<DemographicData> {
  const supabase = await createClient();
  
  try {
    const { data: yearRes } = await supabase.from('mv_demographic_stats').select('data_year').order('data_year', { ascending: false }).limit(1);
    const latestYear = yearRes?.[0]?.data_year || 2025;

    const { data, error } = await supabase.from('mv_demographic_stats').select('*').eq('data_year', latestYear).order('sort_order', { ascending: true });

    if (error || !data || data.length === 0) return mockDemographics as unknown as DemographicData;

    const result: DemographicData = {
      population: { total: 0, households: 0, male: 0, female: 0 },
      hamlets: [], occupations: [], education: [], marital_status: [], family_relationship: [], age_groups: []
    };

    data.forEach((item) => {
      const cat = item.category_slug;
      const label = item.label.toLowerCase();
      
      if (cat === 'population') {
        if (label.includes('total')) result.population.total = item.value;
        else if (label.includes('laki')) result.population.male = item.value;
        else if (label.includes('perempuan')) result.population.female = item.value;
        else if (label.includes('keluarga')) result.population.households = item.value;
      } 
      else if (Object.prototype.hasOwnProperty.call(result, cat)) {
        const list = (result as unknown as Record<string, unknown>)[cat];
        if (Array.isArray(list)) {
          list.push({ name: item.label, label: item.label, value: item.value });
        }
      }
    });

    // Clean up demographics: Map names to labels consistently and sort
    const categoriesToMap = ['hamlets', 'occupations', 'education', 'marital_status', 'family_relationship', 'age_groups'];
    categoriesToMap.forEach(cat => {
      const list = (result as unknown as Record<string, unknown>)[cat];
      if (Array.isArray(list)) {
        (result as unknown as Record<string, unknown>)[cat] = list.map((i) => {
          const item = i as { label?: string; name?: string; value: number };
          return {
            label: (item.label || item.name) as string,
            name: (item.name || item.label) as string,
            value: item.value
          };
        });
      }
    });

    result.occupations.sort((a, b) => b.value - a.value);
    result.occupations = result.occupations.slice(0, 5);
    
    return result;
  } catch {
    return mockDemographics as unknown as DemographicData;
  }
}

export async function getRawDemographics(year?: number) {
  const supabase = await createClient();
  let targetYear = year;
  if (!targetYear) {
    const { data: yearRes } = await supabase.from('mv_demographic_stats').select('data_year').order('data_year', { ascending: false }).limit(1);
    targetYear = yearRes?.[0]?.data_year || 2025;
  }

  const { data, error } = await supabase.from('mv_demographic_stats').select('*').eq('data_year', targetYear).order('category_slug', { ascending: true });
  if (error) throw error;

  return data.map(item => ({
    id: `${item.category_slug}-${item.label}`,
    label: item.label,
    value: item.value,
    category: { name: item.category_slug.replace('_', ' ').toUpperCase() }
  }));
}

export async function getCategories(type?: string) {
  const supabase = await createClient();
  let query = supabase.from('categories').select('*');
  if (type) query = query.eq('type', type);
  const { data, error } = await query;
  if (error) throw error;
  return data;
}

export async function getVillageInfo() {
  const supabase = await createClient();
  try {
    const { data, error } = await supabase.from('village_info').select('*').single();
    if (error || !data) return mockVillageInfo;
    return data;
  } catch { return mockVillageInfo; }
}

export async function getProfiles() {
  const supabase = await createClient();
  const { data, error } = await supabase.from('profiles').select('*').order('updated_at', { ascending: false });
  if (error) throw error;
  return data;
}

export async function getAllVillageImages(): Promise<VillageImage[]> {
  const supabase = await createClient();
  const [postsRes, infoRes] = await Promise.all([
    supabase.from('posts').select('title, slug, image_url, created_at').not('image_url', 'is', null).order('created_at', { ascending: false }),
    supabase.from('village_info').select('logo_url, header_banner_url').single()
  ]);
  const images: VillageImage[] = [];
  if (postsRes.data) {
    postsRes.data.forEach(post => {
      images.push({ url: post.image_url!, title: post.title, source: 'post', date: post.created_at, link: `/posts/${post.slug}` });
    });
  }
  if (infoRes.data) {
    if (infoRes.data.logo_url) images.push({ url: infoRes.data.logo_url, title: 'Logo Resmi Desa', source: 'branding', date: new Date().toISOString() });
    if (infoRes.data.header_banner_url) images.push({ url: infoRes.data.header_banner_url, title: 'Banner Utama Desa', source: 'branding', date: new Date().toISOString() });
  }
  return images.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export async function getHomepageData() {
  const supabase = await createClient();
  
  const currentYear = new Date().getFullYear();
  
  // Helper for budget calculation
  const budgetQuery = supabase.from('finances').select('amount').eq('type', 'income').eq('year', currentYear);
  
  // Helper for demo stats
  const getDemoStats = async () => {
    const { data: yearRes } = await supabase.from('mv_demographic_stats').select('data_year').order('data_year', { ascending: false }).limit(1);
    const latestYear = yearRes?.[0]?.data_year || 2025;
    const { data } = await supabase.from('mv_demographic_stats').select('category_slug, label, value').eq('data_year', latestYear);
    return {
      population: data?.find(d => d.category_slug === 'population' && d.label.toLowerCase().includes('total'))?.value || 0,
      hamletCount: data?.filter(d => d.category_slug === 'hamlets').length || 0
    };
  };

  const [vInfo, posts, sCount, staff, budgetRes, demo] = await Promise.all([
    supabase.from('village_info').select('name, logo_url, header_banner_url').single(),
    supabase.from('posts').select('title, slug, image_url, created_at, categories(name)').eq('status', 'published').order('created_at', { ascending: false }).limit(3),
    supabase.from('staff_members').select('id', { count: 'exact', head: true }),
    supabase.from('staff_members').select('name, position, photo_url').order('order_index', { ascending: true }).limit(4),
    budgetQuery,
    getDemoStats()
  ]);

  const budget = budgetRes.data?.reduce((sum, item) => sum + item.amount, 0) || 0;

  return {
    villageName: vInfo.data?.name || 'Desa Kami',
    logoUrl: vInfo.data?.logo_url,
    bannerUrl: vInfo.data?.header_banner_url,
    population: demo.population,
    budget,
    hamletCount: demo.hamletCount,
    staffCount: sCount.count || 0,
    posts: (posts.data || []).map((p) => ({
      ...p,
      categories: Array.isArray(p.categories) ? p.categories[0] : (p.categories as unknown as { name: string } | null)
    })),
    staff: staff.data || [],
  };
}
