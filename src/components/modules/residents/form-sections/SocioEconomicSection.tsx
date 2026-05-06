'use client';

import { useState } from 'react';
import { Briefcase, GraduationCap, Heart, Users } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import CustomSelect from '@/components/ui/CustomSelect';

const EDUCATION_OPTIONS = [
  { id: 'Belum / Tidak Sekolah', name: 'Belum / Tidak Sekolah' },
  { id: 'SD / Sederajat', name: 'SD / Sederajat' },
  { id: 'SMP / Sederajat', name: 'SMP / Sederajat' },
  { id: 'SMA / Sederajat', name: 'SMA / Sederajat' },
  { id: 'Diploma / Sarjana', name: 'Diploma / Sarjana' },
  { id: 'CUSTOM', name: '... Input Manual' },
];

const OCCUPATION_OPTIONS = [
  { id: 'Petani / Pekebun', name: 'Petani / Pekebun' },
  { id: 'Pelajar / Mahasiswa', name: 'Pelajar / Mahasiswa' },
  { id: 'Ibu Rumah Tangga', name: 'Ibu Rumah Tangga' },
  { id: 'Pegawai / ASN', name: 'Pegawai / ASN' },
  { id: 'Swasta / Karyawan', name: 'Swasta / Karyawan' },
  { id: 'Wiraswasta / Jasa', name: 'Wiraswasta / Jasa' },
  { id: 'Tidak / Belum Bekerja', name: 'Tidak / Belum Bekerja' },
  { id: 'CUSTOM', name: '... Input Manual' },
];

const MARITAL_OPTIONS = [
  { id: 'Belum Kawin', name: 'Belum Kawin' },
  { id: 'Kawin', name: 'Kawin' },
  { id: 'Cerai Hidup', name: 'Cerai Hidup' },
  { id: 'Cerai Mati', name: 'Cerai Mati' },
];

const RELATIONSHIP_OPTIONS = [
  { id: 'KEPALA KELUARGA', name: 'KEPALA KELUARGA' },
  { id: 'SUAMI', name: 'SUAMI' },
  { id: 'ISTRI', name: 'ISTRI' },
  { id: 'ANAK', name: 'ANAK' },
  { id: 'ORANG TUA', name: 'ORANG TUA' },
  { id: 'MERTUA', name: 'MERTUA' },
  { id: 'CUCU', name: 'CUCU' },
  { id: 'MENANTU', name: 'MENANTU' },
  { id: 'LAINNYA', name: 'LAINNYA' },
];

interface SocioEconomicSectionProps {
  defaultValues?: {
    education?: string | null;
    occupation?: string | null;
    marital_status?: string | null;
    family_relationship?: string | null;
    data_year?: number;
  } | undefined;
}

export default function SocioEconomicSection({ defaultValues }: SocioEconomicSectionProps) {
  const [customEdu, setCustomEdu] = useState(() => 
    !!defaultValues?.education && !EDUCATION_OPTIONS.find(o => o.id === defaultValues.education)
  );
  const [customOcc, setCustomOcc] = useState(() => 
    !!defaultValues?.occupation && !OCCUPATION_OPTIONS.find(o => o.id === defaultValues.occupation)
  );

  const [eduVal, setEduVal] = useState(defaultValues?.education || '');
  const [occVal, setOccVal] = useState(defaultValues?.occupation || '');

  return (
    <div className="space-y-6 sm:space-y-8 pt-4 sm:pt-6 border-t border-border">
      <div className="flex items-center gap-3 border-b border-border pb-4">
        <div className="p-1.5 sm:p-2 bg-primary/10 text-primary rounded-lg">
          <Briefcase size={18} />
        </div>
        <h3 className="text-xs sm:text-sm font-bold uppercase tracking-[0.2em] text-foreground">Sosial & Ekonomi</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-8">
        <div className="space-y-2">
          {customEdu ? (
            <div className="space-y-2 animate-in slide-in-from-left-1">
              <div className="flex justify-between items-center">
                <Label>Pendidikan (Manual)</Label>
                <button type="button" onClick={() => setCustomEdu(false)} className="text-[9px] font-bold text-primary uppercase">Kembali ke List</button>
              </div>
              <Input
                name="education"
                value={eduVal}
                onChange={(e) => setEduVal(e.target.value.toUpperCase())}
                placeholder="INPUT PENDIDIKAN"
                className="uppercase h-11 sm:h-12 text-sm font-bold text-primary border-primary/30"
                autoFocus
                required
              />
            </div>
          ) : (
            <CustomSelect
              label="Pendidikan Terakhir"
              name="education"
              options={EDUCATION_OPTIONS}
              defaultValue={defaultValues?.education || ''}
              icon={GraduationCap}
              onChange={(val) => { if (val === 'CUSTOM') setCustomEdu(true); }}
              required
            />
          )}
        </div>
        <div className="space-y-2">
          {customOcc ? (
            <div className="space-y-2 animate-in slide-in-from-left-1">
              <div className="flex justify-between items-center">
                <Label>Pekerjaan (Manual)</Label>
                <button type="button" onClick={() => setCustomOcc(false)} className="text-[9px] font-bold text-primary uppercase">Kembali ke List</button>
              </div>
              <Input
                name="occupation"
                value={occVal}
                onChange={(e) => setOccVal(e.target.value.toUpperCase())}
                placeholder="INPUT PEKERJAAN"
                className="uppercase h-11 sm:h-12 text-sm font-bold text-primary border-primary/30"
                autoFocus
                required
              />
            </div>
          ) : (
            <CustomSelect
              label="Pekerjaan Utama"
              name="occupation"
              options={OCCUPATION_OPTIONS}
              defaultValue={defaultValues?.occupation || ''}
              icon={Briefcase}
              onChange={(val) => { if (val === 'CUSTOM') setCustomOcc(true); }}
              required
            />
          )}
        </div>
        <div className="space-y-2">
          <CustomSelect
            label="Status Perkawinan"
            name="marital_status"
            options={MARITAL_OPTIONS}
            defaultValue={defaultValues?.marital_status || ''}
            icon={Heart}
            required
          />
        </div>
        <div className="space-y-2">
          <CustomSelect
            label="Hubungan Keluarga"
            name="family_relationship"
            options={RELATIONSHIP_OPTIONS}
            defaultValue={defaultValues?.family_relationship || ''}
            icon={Users}
            required
          />
        </div>
        <div className="space-y-2">
          <Label>Tahun Pendataan</Label>
          <Input 
            name="data_year" 
            type="number" 
            defaultValue={defaultValues?.data_year || new Date().getFullYear()} 
            required 
            className="font-mono h-11 sm:h-12 text-sm" 
          />
        </div>
      </div>
    </div>
  );
}