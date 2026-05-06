'use client';

import { Users } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface ParentSectionProps {
  defaultValues?: {
    father_name?: string | null;
    mother_name?: string | null;
  } | undefined;
}

export default function ParentSection({ defaultValues }: ParentSectionProps) {
  return (
    <div className="space-y-6 sm:space-y-8 pt-4 sm:pt-6 border-t border-border">
      <div className="flex items-center gap-3 border-b border-border pb-4">
        <div className="p-1.5 sm:p-2 bg-primary/10 text-primary rounded-lg">
          <Users size={18} />
        </div>
        <h3 className="text-xs sm:text-sm font-bold uppercase tracking-[0.2em] text-foreground">Data Orang Tua</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-8">
        <div className="space-y-2">
          <Label>Nama Lengkap Ayah</Label>
          <Input 
            name="father_name" 
            defaultValue={defaultValues?.father_name || ''} 
            placeholder="AYAH KANDUNG" 
            className="uppercase h-11 sm:h-12 text-sm" 
          />
        </div>
        <div className="space-y-2">
          <Label>Nama Lengkap Ibu</Label>
          <Input 
            name="mother_name" 
            defaultValue={defaultValues?.mother_name || ''} 
            placeholder="IBU KANDUNG" 
            className="uppercase h-11 sm:h-12 text-sm" 
          />
        </div>
      </div>
    </div>
  );
}