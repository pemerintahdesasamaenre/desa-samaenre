import { createClient } from '@/lib/supabase/server';
import mockDemographics from '@/data/mock/demographics.json';
import mockVillageInfo from '@/data/mock/village-info.json';

export async function getDemographics() {
  const supabase = await createClient();
  
  try {
    const { data, error } = await supabase
      .from('demographics')
      .select('*, categories(*)');

    if (error || !data || data.length === 0) {
      console.warn('Using fallback mock data for demographics');
      return mockDemographics;
    }

    // Transform raw data to the structure expected by charts if needed
    // For now, let's assume the mock data structure is what we want for the home page
    // but the raw data is needed for the admin page.
    // Actually, if data is present, we should transform it.
    // BUT the home page already uses it assuming it's the transformed structure.
    
    return mockDemographics; // Temporary fallback to keep home page working
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
