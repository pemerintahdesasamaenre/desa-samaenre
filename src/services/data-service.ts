import { createClient } from '@/lib/supabase/server';
import mockDemographics from '@/data/mock/demographics.json';
import mockVillageInfo from '@/data/mock/village-info.json';

export async function getDemographics() {
  const supabase = await createClient();
  
  try {
    const { data, error } = await supabase
      .from('demographics')
      .select('*, category:categories(*)');

    if (error || !data || data.length === 0) {
      console.warn('Using fallback mock data for demographics');
      return mockDemographics;
    }

    // Initialize the structure with defaults
    const result: any = {
      population: { total: 0, households: 0, male: 0, female: 0 },
      hamlets: [],
      occupations: [],
      education: [],
      marital_status: [],
      religion: []
    };

    data.forEach((item: any) => {
      const slug = item.category?.slug;
      
      if (slug === 'populasi') {
        const label = item.label.toLowerCase();
        if (label.includes('total')) result.population.total = item.value;
        else if (label.includes('keluarga')) result.population.households = item.value;
        else if (label.includes('laki')) result.population.male = item.value;
        else if (label.includes('perempuan')) result.population.female = item.value;
      } else if (slug === 'dusun') {
        result.hamlets.push({ name: item.label, value: item.value });
      } else if (slug === 'pekerjaan') {
        result.occupations.push({ label: item.label, value: item.value });
      } else if (slug === 'pendidikan') {
        result.education.push({ label: item.label, value: item.value });
      } else if (slug === 'status-perkawinan') {
        result.marital_status.push({ label: item.label, value: item.value });
      } else if (slug === 'agama') {
        result.religion.push({ label: item.label, value: item.value });
      }
    });
    
    return result;
  } catch (e) {
    console.warn('Supabase not connected, using fallback mock data');
    return mockDemographics;
  }
}

export async function getRawDemographics() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('demographics')
    .select('*, category:categories(*)');
  
  if (error) throw error;
  return data;
}

export async function getCategories(type?: string) {
  const supabase = await createClient();
  let query = supabase.from('categories').select('*');
  if (type) {
    query = query.eq('type', type);
  }
  const { data, error } = await query;
  if (error) throw error;
  return data;
}

export async function getVillageInfo() {
  const supabase = await createClient();

  try {
    const { data, error } = await supabase
      .from('village_info')
      .select('*')
      .single();

    if (error || !data) {
      console.warn('Using fallback mock data for village info');
      return mockVillageInfo;
    }

    return data;
  } catch (e) {
    console.warn('Supabase not connected, using fallback mock data');
    return mockVillageInfo;
  }
}

export async function getProfiles() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .order('updated_at', { ascending: false });
  
  if (error) throw error;
  return data;
}

export async function getHomepageData() {
  const supabase = await createClient();

  const villageInfoPromise = supabase.from('village_info').select('name').single();
  
  const populationPromise = supabase
    .from('demographics')
    .select('value')
    .eq('label', 'Total Populasi')
    .single();

  const budgetPromise = supabase
    .from('finances')
    .select('amount')
    .eq('type', 'income')
    .eq('year', new Date().getFullYear());

  const hamletsPromise = supabase
    .from('demographics')
    .select('id', { count: 'exact' })
    .eq('category_id', 'c3d4e5f6-a7b8-9012-3456-7890abcdef01'); // Assuming 'populasi' category id is stable

  const staffCountPromise = supabase
    .from('staff_members')
    .select('id', { count: 'exact' });

  const postsPromise = supabase
    .from('posts')
    .select('title, slug, created_at, categories(name)')
    .eq('status', 'published')
    .order('created_at', { ascending: false })
    .limit(3);
    
  const staffPromise = supabase
    .from('staff_members')
    .select('name, position, photo_url')
    .in('position', ['Kepala Desa', 'Sekretaris Desa'])
    .limit(4);

  const [
    villageInfo,
    population,
    budget,
    hamlets,
    staffCount,
    posts,
    staff
  ] = await Promise.all([
    villageInfoPromise,
    populationPromise,
    budgetPromise,
    hamletsPromise,
    staffCountPromise,
    postsPromise,
    staffPromise
  ]);

  const totalBudget = budget.data?.reduce((sum, item) => sum + item.amount, 0) || 0;

  return {
    villageName: villageInfo.data?.name || 'Desa',
    population: population.data?.value || 0,
    budget: totalBudget,
    hamletCount: hamlets.count || 0,
    staffCount: staffCount.count || 0,
    posts: posts.data || [],
    staff: staff.data || [],
  };
}
