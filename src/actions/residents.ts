'use server'

import { createClient } from '@/lib/supabase/server';
import { hashNIK, encrypt, decrypt } from '@/lib/crypto';
import { revalidatePath } from 'next/cache';
import { residentSchema, type ResidentInput } from '@/lib/validations';
import { logActivity } from '@/actions/analytics';
import { mapResidentToDisplay } from '@/lib/utils/resident';
import { getAuthUser } from '@/lib/utils/auth';
import { protectedAction, type ActionResponse } from '@/lib/utils/action-handler';
import { Resident } from '@/types';

export async function getResidents(params: { 
  page: number, 
  limit: number, 
  search?: string, 
  dusun?: string 
}) {
  const user = await getAuthUser();
  if (!user) return { data: [], total: 0, error: 'Unauthorized' };

  const { page, limit, search, dusun } = params;
  const supabase = await createClient();
  
  try {
    let query = supabase.from('residents').select('*');
    
    if (dusun && dusun !== 'SEMUA') {
      query = query.eq('dusun', dusun);
    }

    const { data, error } = await query.order('created_at', { ascending: false });
    
    if (error) throw error;
    if (!data) return { data: [], total: 0 };

    let decryptedData = data.map(mapResidentToDisplay);

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
  const user = await getAuthUser();
  if (!user) return null;

  const supabase = await createClient();
  try {
    const { data, error } = await supabase.from('residents').select('*').eq('id', id).single();
    if (error) throw error;
    if (!data) return null;

    const resident = mapResidentToDisplay(data);

    await logSensitiveView(id, resident.name + ' (Form Edit)');

    return resident;
  } catch (e) {
    console.error('ERROR in getResidentById:', JSON.stringify(e, null, 2));
    return null;
  }
}

export async function upsertResident(data: ResidentInput, id?: string): Promise<ActionResponse> {
  return protectedAction(async () => {
    const validated = residentSchema.safeParse(data);
    if (!validated.success) {
      return { error: validated.error.flatten().fieldErrors };
    }

    const { nik, kk, name, ...rest } = validated.data;

    const residentData = {
      ...rest,
      nik_hash: hashNIK(nik),
      kk_hash: hashNIK(kk),
      nik_enc: encrypt(nik),
      kk_enc: encrypt(kk),
      name_enc: encrypt(name),
    };

    const supabase = await createClient();
    
    let result;
    if (id) {
      result = await supabase.from('residents').update(residentData).eq('id', id);
    } else {
      result = await supabase.from('residents').insert(residentData);
    }

    if (result.error) throw result.error;

    await logActivity({
      action: id ? `Update data: ${name}` : `Tambah penduduk: ${name}`,
      entity_type: 'residents',
      method: id ? 'UPDATE' : 'CREATE',
      details: { name, id: id || 'new' }
    });

    revalidatePath('/admin/residents');
    revalidatePath('/admin/statistics');
    return { success: true };
  });
}

export async function getDusuns() {
  const supabase = await createClient();
  try {
    const { data, error } = await supabase.from('residents').select('dusun');
    if (error) throw error;
    const uniqueDusuns = Array.from(new Set(data.map(d => d.dusun))).filter(Boolean).sort();
    return uniqueDusuns;
  } catch { return []; }
}

export async function deleteResident(id: string): Promise<ActionResponse> {
  return protectedAction(async () => {
    const supabase = await createClient();
    
    const { data: resident } = await supabase.from('residents').select('name_enc').eq('id', id).single();
    const residentName = resident ? decrypt(resident.name_enc) : id;

    const { error } = await supabase.from('residents').delete().eq('id', id);
    if (error) throw error;
    
    await logActivity({
      action: `Hapus penduduk: ${residentName}`,
      entity_type: 'residents',
      method: 'DELETE',
      details: { id, name: residentName }
    });
    
    revalidatePath('/admin/residents');
    revalidatePath('/admin/statistics');
    return { success: true };
  });
}

export async function verifyResidentNIK(nik: string) {
  const supabase = await createClient();
  try {
    const hashedNIK = hashNIK(nik);
    const { data, error } = await supabase
      .from('residents')
      .select('name_enc')
      .eq('nik_hash', hashedNIK)
      .maybeSingle();

    if (error) throw error;
    if (!data) return { success: false, error: 'NIK tidak ditemukan dalam database penduduk.' };

    return { 
      success: true, 
      name: decrypt(data.name_enc)
    };
  } catch (e) {
    console.error('ERROR in verifyResidentNIK:', e);
    return { success: false, error: 'Terjadi kesalahan saat verifikasi NIK.' };
  }
}

export async function logSensitiveView(residentId: string, residentName: string) {
  await logActivity({
    action: `Akses data sensitif: ${residentName}`,
    entity_type: 'residents',
    method: 'VIEW',
    details: { id: residentId, name: residentName }
  });
  return { success: true };
}

export async function importResidents(data: ResidentInput[]): Promise<ActionResponse<{ count: number }>> {
  return protectedAction(async () => {
    if (data.length === 0) return { error: 'Tidak ada data.' };
    
    const supabase = await createClient();
    
    const formattedData = data.map(item => ({
      nik_hash: hashNIK(item.nik),
      kk_hash: hashNIK(item.kk),
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
      family_relationship: item.family_relationship,
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

    await logActivity({
      action: `Import ${formattedData.length} data penduduk`,
      entity_type: 'residents',
      method: 'CREATE',
      details: { count: formattedData.length, year: data[0].data_year }
    });

    revalidatePath('/admin/statistics');
    revalidatePath('/admin/residents');
    return { success: true, data: { count: formattedData.length } };
  });
}

export async function deleteAllResidents(): Promise<ActionResponse> {
  return protectedAction(async () => {
    const supabase = await createClient();
    const { error } = await supabase.from('residents').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    if (error) throw error;

    await logActivity({
      action: 'Menghapus seluruh data penduduk (Reset Data)',
      entity_type: 'residents',
      method: 'DELETE',
      details: { timestamp: new Date().toISOString() }
    });

    revalidatePath('/admin/statistics');
    revalidatePath('/admin/residents');
    return { success: true };
  });
}

const CHECK_FIELDS: (keyof Resident)[] = [
  'nik', 'kk', 'name', 'birth_place', 'birth_date', 
  'gender', 'education', 'occupation', 'marital_status', 
  'family_relationship', 'father_name', 'mother_name', 'dusun'
];

function getMissingFields(resident: Partial<Resident>): string[] {
  const missing: string[] = [];
  CHECK_FIELDS.forEach(field => {
    const val = resident[field];
    if (val === null || val === undefined || val === '' || val === '-' || (typeof val === 'string' && val.toLowerCase() === 'belum diisi')) {
      missing.push(field);
    }
  });
  return missing;
}

export async function getIncompleteStats() {
  const user = await getAuthUser();
  if (!user) return [];

  const supabase = await createClient();
  try {
    const { data, error } = await supabase.from('residents').select('*');
    if (error) throw error;
    if (!data) return [];

    const residents = data.map(mapResidentToDisplay);

    const statsMap: Record<string, number> = {};
    residents.forEach(r => {
      const missing = getMissingFields(r);
      if (missing.length > 0) {
        const dusunName = r.dusun || 'TIDAK ADA DUSUN';
        statsMap[dusunName] = (statsMap[dusunName] || 0) + 1;
      }
    });

    return Object.entries(statsMap).map(([dusun, count]) => ({
      dusun,
      count
    })).sort((a, b) => b.count - a.count);
  } catch (e) {
    console.error(e);
    return [];
  }
}

export async function getIncompleteResidents(dusun?: string) {
  const user = await getAuthUser();
  if (!user) return [];

  const supabase = await createClient();
  try {
    let query = supabase.from('residents').select('*');
    if (dusun && dusun !== 'SEMUA') {
      query = query.eq('dusun', dusun);
    }

    const { data, error } = await query;
    if (error) throw error;
    if (!data) return [];

    const result: (Resident & { missing_fields: string[] })[] = [];
    data.forEach(item => {
      const resident = mapResidentToDisplay(item) as Resident;

      const missing = getMissingFields(resident);
      if (missing.length > 0) {
        result.push({
          ...resident,
          missing_fields: missing
        });
      }
    });

    return result;
  } catch (e) {
    console.error(e);
    return [];
  }
}
