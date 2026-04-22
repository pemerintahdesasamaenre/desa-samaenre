'use server'

import { createClient } from '@/lib/supabase/server';
import { hashNIK, encrypt, decrypt } from '@/lib/crypto';
import { revalidatePath } from 'next/cache';
import { residentSchema, type ResidentInput } from '@/lib/validations';

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

export interface ResidentDisplayData extends ResidentImportData {
  id: string;
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

export async function getResidents(params: { 
  page: number, 
  limit: number, 
  search?: string, 
  dusun?: string 
}) {
  const { page, limit, search, dusun } = params;
  const supabase = await createClient();
  
  try {
    let query = supabase.from('residents').select('*');
    
    if (dusun && dusun !== 'SEMUA') {
      query = query.eq('dusun', dusun);
    }

    // Jika ada pencarian, kita harus memproses di memori karena data terenkripsi
    // Untuk efisiensi, kita ambil data sesuai filter dusun (jika ada)
    const { data, error } = await query.order('created_at', { ascending: false });
    
    if (error) throw error;
    if (!data) return { data: [], total: 0 };

    // Dekripsi data
    let decryptedData: ResidentDisplayData[] = data.map(item => ({
      id: item.id,
      nik: decrypt(item.nik_enc),
      kk: decrypt(item.kk_enc),
      name: decrypt(item.name_enc),
      birth_place: item.birth_place,
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
      data_year: item.data_year
    }));

    // Filter berdasarkan search term
    if (search) {
      const s = search.toLowerCase();
      decryptedData = decryptedData.filter(item => 
        item.nik.toLowerCase().includes(s) || 
        item.kk.toLowerCase().includes(s) || 
        item.name.toLowerCase().includes(s)
      );
    }

    const total = decryptedData.length;
    const paginatedData = decryptedData.slice((page - 1) * limit, page * limit);

    return { data: paginatedData, total };
  } catch (e: unknown) {
    console.error(e);
    return { data: [], total: 0, error: 'Gagal memuat data penduduk.' };
  }
}

export async function getResidentById(id: string) {
  const supabase = await createClient();
  try {
    const { data, error } = await supabase.from('residents').select('*').eq('id', id).single();
    if (error) throw error;
    if (!data) return null;

    // Decrypt sensitive data for form
    const resident: ResidentDisplayData = {
      id: data.id,
      nik: decrypt(data.nik_enc),
      kk: decrypt(data.kk_enc),
      name: decrypt(data.name_enc),
      birth_place: data.birth_place,
      birth_date: data.birth_date,
      gender: data.gender,
      education: data.education,
      occupation: data.occupation,
      marital_status: data.marital_status,
      father_name: data.father_name,
      mother_name: data.mother_name,
      dusun: data.dusun,
      rt: data.rt,
      rw: data.rw,
      data_year: data.data_year
    };

    // Log akses data sensitif saat akan diedit (Non-blocking)
    logSensitiveView(id, resident.name + ' (FOR EDIT)').catch(err => 
      console.error('Logging failed:', err)
    );

    return resident;
  } catch (e) {
    console.error('ERROR in getResidentById:', JSON.stringify(e, null, 2));
    return null;
  }
}

export async function upsertResident(data: ResidentInput, id?: string) {
  const supabase = await createClient();
  
  const validated = residentSchema.safeParse(data);
  if (!validated.success) {
    return { error: validated.error.flatten().fieldErrors };
  }

  const { nik, kk, name, ...rest } = validated.data;

  const residentData = {
    ...rest,
    nik_hash: hashNIK(nik),
    nik_enc: encrypt(nik),
    kk_enc: encrypt(kk),
    name_enc: encrypt(name),
  };

  try {
    let result;
    if (id) {
      result = await supabase.from('residents').update(residentData).eq('id', id);
    } else {
      result = await supabase.from('residents').insert(residentData);
    }

    if (result.error) throw result.error;

    await logActivity(id ? 'UPDATE_RESIDENT' : 'CREATE_RESIDENT', { 
      resident_name: name,
      id: id || 'new'
    });

    revalidatePath('/admin/residents');
    revalidatePath('/admin/statistics');
    return { success: true };
  } catch (e: unknown) {
    return { error: e instanceof Error ? e.message : 'Gagal menyimpan data.' };
  }
}

export async function getDusuns() {
  const supabase = await createClient();
  try {
    const { data, error } = await supabase.from('residents').select('dusun');
    if (error) throw error;
    
    const uniqueDusuns = Array.from(new Set(data.map(d => d.dusun))).filter(Boolean).sort();
    return uniqueDusuns;
  } catch {
    return [];
  }
}

export async function deleteResident(id: string) {
  const supabase = await createClient();
  try {
    const { error } = await supabase.from('residents').delete().eq('id', id);
    if (error) throw error;
    
    await logActivity('DELETE_RESIDENT', { resident_id: id });
    
    revalidatePath('/admin/residents');
    revalidatePath('/admin/statistics');
    return { success: true };
  } catch (e: unknown) {
    return { error: e instanceof Error ? e.message : 'Gagal menghapus data.' };
  }
}

export async function logSensitiveView(residentId: string, residentName: string) {
  await logActivity('VIEW_SENSITIVE_DATA', { 
    resident_id: residentId, 
    resident_name: residentName,
    timestamp: new Date().toISOString()
  });
  return { success: true };
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
      birth_place: item.birth_place,
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

    if (error) {
      console.error('Supabase Upsert Error:', error);
      return { error: error.message || 'Gagal menyimpan ke database.' };
    }

    // CATAT AUDIT
    await logActivity('IMPORT_RESIDENTS', { 
      count: formattedData.length,
      year: data[0].data_year,
      dusun_list: Array.from(new Set(data.map(d => d.dusun)))
    });

    revalidatePath('/admin/statistics');
    revalidatePath('/admin/residents');
    return { success: true, count: formattedData.length };
  } catch (e: unknown) {
    console.error('Import residents exception:', e);
    // Kembalikan pesan error asli agar bisa didebug di UI
    const errorMessage = e instanceof Error ? e.message : (typeof e === 'object' && e !== null && 'message' in e) ? (e as any).message : 'Terjadi kesalahan sistem yang tidak diketahui.';
    return { error: errorMessage };
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
