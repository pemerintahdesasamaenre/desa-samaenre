import { decrypt } from '@/lib/crypto';
import type { ResidentDisplayData } from '@/actions/residents';

export function mapResidentToDisplay(item: Record<string, unknown>): ResidentDisplayData {
  return {
    id: item.id as string,
    nik: decrypt(item.nik_enc as string),
    kk: decrypt(item.kk_enc as string),
    name: decrypt(item.name_enc as string),
    birth_place: item.birth_place as string,
    birth_date: item.birth_date as string | null,
    gender: item.gender as 'L' | 'P',
    education: item.education as string,
    occupation: item.occupation as string,
    marital_status: item.marital_status as string,
    family_relationship: item.family_relationship as string,
    father_name: item.father_name as string,
    mother_name: item.mother_name as string,
    dusun: item.dusun as string,
    rt: item.rt as string,
    rw: item.rw as string,
    data_year: item.data_year as number
  };
}

export function maskString(str: string) {
  if (!str) return '';
  if (str.length <= 6) return '******';
  return `${str.slice(0, 6)}**********`;
}
