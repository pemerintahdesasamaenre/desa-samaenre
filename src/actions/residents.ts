'use server'

import { createClient } from '@/lib/supabase/server';
import { hashNIK, encrypt } from '@/lib/crypto';
import { revalidatePath } from 'next/cache';

export interface ResidentImportData {
  nik: string;
  kk: string;
  name: string;
  birth_place: string;
  birth_date: string | null;
  gender: 'L' | 'P';
  education: string;
  occupation: string;
  marital_status: string;
  father_name: string;
  mother_name: string;
  dusun: string;
  rt: string;
  rw: string;
  data_year: number;
}

/**
 * Catat aktivitas ke tabel audit_logs
 */
async function logActivity(action: string, details: Record<string, unknown>) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  await supabase.from('activity_logs').insert({
    user_id: user?.id,
    action,
    entity_type: 'residents',
    details
  });
}

export async function importResidents(data: ResidentImportData[]) {
  if (data.length === 0) return { error: 'Tidak ada data.' };

  const supabase = await createClient();
  
  try {
    const formattedData = data.map(item => ({
      nik_hash: hashNIK(item.nik),
      nik_enc: encrypt(item.nik),
      kk_enc: encrypt(item.kk),
      name_enc: encrypt(item.name),
      data_year: item.data_year,
      birth_date: item.birth_date,
      gender: item.gender,
      education: item.education,
      occupation: item.occupation,
      marital_status: item.marital_status,
      father_name: item.father_name,
      mother_name: item.mother_name,
      dusun: item.dusun,
      rt: item.rt,
      rw: item.rw,
    }));

    const { error } = await supabase.from('residents').upsert(formattedData, { 
      onConflict: 'nik_hash, data_year' 
    });

    if (error) throw error;

    // CATAT AUDIT
    await logActivity('IMPORT_RESIDENTS', { 
      count: formattedData.length,
      year: data[0].data_year,
      dusun_list: Array.from(new Set(data.map(d => d.dusun)))
    });

    revalidatePath('/admin/statistics');
    return { success: true, count: formattedData.length };
  } catch (e: unknown) {
    console.error(e);
    return { error: e instanceof Error ? e.message : 'Terjadi kesalahan sistem.' };
  }
}

export async function deleteAllResidents() {
  const supabase = await createClient();
  
  try {
    const { error } = await supabase.from('residents').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    if (error) throw error;

    // CATAT AUDIT
    await logActivity('DELETE_ALL_RESIDENTS', { timestamp: new Date().toISOString() });

    revalidatePath('/admin/statistics');
    return { success: true };
  } catch (e: unknown) {
    return { error: e instanceof Error ? e.message : 'Gagal menghapus data.' };
  }
}
