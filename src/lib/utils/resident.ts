import { decrypt } from '@/lib/crypto';
import type { ResidentDisplayData } from '@/actions/residents';

export function mapResidentToDisplay(item: any): ResidentDisplayData {
  return {
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
    family_relationship: item.family_relationship,
    father_name: item.father_name,
    mother_name: item.mother_name,
    dusun: item.dusun,
    rt: item.rt,
    rw: item.rw,
    data_year: item.data_year
  };
}

export function maskString(str: string) {
  if (!str) return '';
  if (str.length <= 6) return '******';
  return `${str.slice(0, 6)}**********`;
}
