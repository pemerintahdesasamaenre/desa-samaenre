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

  // 1. Fetch Village Info (always needed)
  const villageInfoPromise = supabase.from('village_info').select('name').single();
  
  // 2. Fetch Latest News (always needed)
  const postsPromise = supabase
    .from('posts')
    .select('title, slug, created_at, categories(name)')
    .eq('status', 'published')
    .order('created_at', { ascending: false })
    .limit(3);

  // 3. Fetch Staff Summary
  const staffCountPromise = supabase
    .from('staff_members')
    .select('id', { count: 'exact' });

  const staffPromise = supabase
    .from('staff_members')
    .select('name, position, photo_url')
    .order('order_index', { ascending: true })
    .limit(4);

  // 4. Fetch Budget (Try current year, then latest available)
  const fetchBudget = async () => {
    const currentYear = new Date().getFullYear();
    const { data: currentData } = await supabase
      .from('finances')
      .select('amount')
      .eq('type', 'income')
      .eq('year', currentYear);
    
    if (currentData && currentData.length > 0) {
      return currentData.reduce((sum, item) => sum + item.amount, 0);
    }

    // Fallback to latest year
    const { data: latestYearData } = await supabase
      .from('finances')
      .select('year')
      .eq('type', 'income')
      .order('year', { ascending: false })
      .limit(1);
    
    if (latestYearData && latestYearData.length > 0) {
      const { data: latestData } = await supabase
        .from('finances')
        .select('amount')
        .eq('type', 'income')
        .eq('year', latestYearData[0].year);
      return latestData?.reduce((sum, item) => sum + item.amount, 0) || 0;
    }
    return 0;
  };

  // 5. Fetch Population and Hamlet Count (using slugs)
  const fetchDemographicStats = async () => {
    const { data: cats } = await supabase
      .from('categories')
      .select('id, slug')
      .in('slug', ['populasi', 'dusun']);
    
    const popCat = cats?.find(c => c.slug === 'populasi');
    const dusunCat = cats?.find(c => c.slug === 'dusun');

    let population = 0;
    let hamletCount = 0;

    if (popCat) {
      const { data: popData } = await supabase
        .from('demographics')
        .select('value')
        .eq('category_id', popCat.id)
        .ilike('label', '%total%')
        .limit(1);
      population = popData?.[0]?.value || 0;
    }

    if (dusunCat) {
      const { count } = await supabase
        .from('demographics')
        .select('id', { count: 'exact' })
        .eq('category_id', dusunCat.id);
      hamletCount = count || 0;
    } else {
      // Fallback: If no 'dusun' category, maybe check 'populasi' for any label with 'dusun'
      const { count } = await supabase
        .from('demographics')
        .select('id', { count: 'exact' })
        .ilike('label', '%dusun%');
      hamletCount = count || 0;
    }

    return { population, hamletCount };
  };

  // --- Parallel Execution ---
  const [
    villageInfoRes,
    postsRes,
    staffCountRes,
    staffRes,
    budget,
    demoStats
  ] = await Promise.all([
    villageInfoPromise,
    postsPromise,
    staffCountPromise,
    staffPromise,
    fetchBudget(),
    fetchDemographicStats()
  ]);

  return {
    villageName: villageInfoRes.data?.name || 'Desa Kami',
    population: demoStats.population,
    budget: budget,
    hamletCount: demoStats.hamletCount,
    staffCount: staffCountRes.count || 0,
    posts: (postsRes.data || []).map((post: any) => ({
      ...post,
      categories: Array.isArray(post.categories) ? post.categories[0] : post.categories
    })),
    staff: staffRes.data || [],
  };
}
