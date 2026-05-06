'use client';

import { Calendar, User } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import CustomSelect from '@/components/ui/CustomSelect';

const GENDER_OPTIONS = [
  { id: 'L', name: 'Laki-laki' },
  { id: 'P', name: 'Perempuan' }
];

interface BirthGenderSectionProps {
  defaultValues?: {
    birth_place?: string | null;
    birth_date?: string | null;
    gender?: 'L' | 'P';
  } | undefined;
}

export default function BirthGenderSection({ defaultValues }: BirthGenderSectionProps) {
  return (
    <div className="space-y-6 sm:space-y-8 pt-4 sm:pt-6 border-t border-border">
      <div className="flex items-center gap-3 border-b border-border pb-4">
        <div className="p-1.5 sm:p-2 bg-primary/10 text-primary rounded-lg">
          <Calendar size={18} />
        </div>
        <h3 className="text-xs sm:text-sm font-bold uppercase tracking-[0.2em] text-foreground">Kelahiran & Gender</h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 sm:gap-8">
        <div className="space-y-2">
          <Label>Tempat Lahir</Label>
          <Input 
            name="birth_place" 
            defaultValue={defaultValues?.birth_place || ''} 
            placeholder="KOTA / KABUPATEN" 
            className="uppercase h-11 sm:h-12 text-sm" 
          />
        </div>
        <div className="space-y-2">
          <Label>Tanggal Lahir</Label>
          <Input 
            name="birth_date" 
            type="date" 
            defaultValue={defaultValues?.birth_date || ''} 
            required 
            className="h-11 sm:h-12 text-sm" 
          />
        </div>
        <div className="space-y-2">
          <CustomSelect
            label="Jenis Kelamin"
            name="gender"
            options={GENDER_OPTIONS}
            defaultValue={defaultValues?.gender || 'L'}
            icon={User}
            required
          />
        </div>
      </div>
    </div>
  );
}