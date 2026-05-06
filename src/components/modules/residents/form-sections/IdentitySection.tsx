'use client';

import { useState } from 'react';
import { Contact, Eye, EyeOff } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface IdentitySectionProps {
  defaultValues?: {
    nik?: string;
    kk?: string;
    name?: string;
  } | undefined;
}

export default function IdentitySection({ defaultValues }: IdentitySectionProps) {
  const [showNik, setShowNik] = useState(false);
  const [showKk, setShowKk] = useState(false);

  return (
    <div className="space-y-6 sm:space-y-8">
      <div className="flex items-center gap-3 border-b border-border pb-4">
        <div className="p-1.5 sm:p-2 bg-primary/10 text-primary rounded-lg">
          <Contact size={18} />
        </div>
        <h3 className="text-xs sm:text-sm font-bold uppercase tracking-[0.2em] text-foreground">Identitas Utama</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-8">
        <div className="space-y-2">
          <Label>NIK (16 Digit)</Label>
          <div className="relative">
            <Input
              name="nik"
              type={showNik ? "text" : "password"}
              defaultValue={defaultValues?.nik || ''}
              required
              maxLength={16}
              placeholder="Masukkan NIK 16 Digit"
              className="font-mono tracking-widest h-11 sm:h-12 text-sm"
            />
            <button 
              type="button" 
              onClick={() => setShowNik(!showNik)} 
              className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary"
            >
              {showNik ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>
        <div className="space-y-2">
          <Label>No. Kartu Keluarga (16 Digit)</Label>
          <div className="relative">
            <Input
              name="kk"
              type={showKk ? "text" : "password"}
              defaultValue={defaultValues?.kk || ''}
              required
              maxLength={16}
              placeholder="Masukkan No. KK 16 Digit"
              className="font-mono tracking-widest h-11 sm:h-12 text-sm"
            />
            <button 
              type="button" 
              onClick={() => setShowKk(!showKk)} 
              className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary"
            >
              {showKk ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>
        <div className="space-y-2 md:col-span-2">
          <Label>Nama Lengkap (Sesuai KTP)</Label>
          <Input
            name="name"
            defaultValue={defaultValues?.name || ''}
            required
            placeholder="NAMA LENGKAP"
            className="uppercase font-bold h-11 sm:h-12 tracking-tight text-sm"
          />
        </div>
      </div>
    </div>
  );
}