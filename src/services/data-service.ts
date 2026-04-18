import { createClient } from '@/lib/supabase/server';
import mockDemographics from '@/data/mock/demographics.json';
import mockVillageInfo from '@/data/mock/village-info.json';

export async function getDemographics() {
  const supabase = createClient();
  
  try {
    const { data, error } = await supabase
      .from('demographics')
      .select('*, categories(*)');

    if (error || !data || data.length === 0) {
      console.warn('Using fallback mock data for demographics');
      return mockDemographics;
    }

    return data;
  } catch (e) {
    console.warn('Supabase not connected, using fallback mock data');
    return mockDemographics;
  }
}

export async function getVillageInfo() {
  const supabase = createClient();

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
