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
