'use client';

import { useState } from 'react';
import { MapPin, Edit3 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import CustomSelect from '@/components/ui/CustomSelect';

const DUSUN_OPTIONS = [
  { id: 'BT. SIRING', name: 'BT. SIRING' },
  { id: 'MALEMPO', name: 'MALEMPO' },
  { id: 'MALLENRENG', name: 'MALLENRENG' },
  { id: 'REALOLO', name: 'REALOLO' },
  { id: 'CUSTOM', name: '... Input Manual' },
];

interface DomicileSectionProps {
  defaultValues?: {
    dusun?: string | null;
    rt?: string | null;
    rw?: string | null;
  } | undefined;
}

export default function DomicileSection({ defaultValues }: DomicileSectionProps) {
  const [customDusun, setCustomDusun] = useState(() => 
    !!defaultValues?.dusun && !DUSUN_OPTIONS.find(o => o.id === defaultValues.dusun)
  );
  const [dusunVal, setDusunVal] = useState(defaultValues?.dusun || '');

  return (
    <div className="space-y-6 sm:space-y-8 pt-4 sm:pt-6 border-t border-border">
      <div className="flex items-center gap-3 border-b border-border pb-4">
        <div className="p-1.5 sm:p-2 bg-primary/10 text-primary rounded-lg">
          <MapPin size={18} />
        </div>
        <h3 className="text-xs sm:text-sm font-bold uppercase tracking-[0.2em] text-foreground">Domisili (Alamat)</h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 sm:gap-8">
        <div className="space-y-2 sm:col-span-1">
          {customDusun ? (
            <div className="space-y-2 animate-in slide-in-from-left-1">
              <div className="flex justify-between items-center">
                <Label>Nama Dusun (Manual)</Label>
                <button 
                  type="button" 
                  onClick={() => setCustomDusun(false)} 
                  className="text-[9px] font-bold text-primary uppercase"
                >
                  Kembali ke List
                </button>
              </div>
              <div className="relative">
                <Input
                  name="dusun"
                  value={dusunVal}
                  onChange={(e) => setDusunVal(e.target.value.toUpperCase())}
                  placeholder="INPUT NAMA DUSUN"
                  className="uppercase h-11 sm:h-12 pl-10 text-sm font-bold text-primary border-primary/30"
                  autoFocus
                  required
                />
                <Edit3 size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-primary" />
              </div>
            </div>
          ) : (
            <CustomSelect
              label="Nama Dusun"
              name="dusun"
              options={DUSUN_OPTIONS}
              defaultValue={defaultValues?.dusun || ''}
              icon={MapPin}
              onChange={(val) => { if (val === 'CUSTOM') setCustomDusun(true); }}
              required
            />
          )}
        </div>
        <div className="space-y-2">
          <Label>RT</Label>
          <Input 
            name="rt" 
            defaultValue={defaultValues?.rt || ''} 
            placeholder="000" 
            className="font-mono h-11 sm:h-12 text-sm text-center" 
          />
        </div>
        <div className="space-y-2">
          <Label>RW</Label>
          <Input 
            name="rw" 
            defaultValue={defaultValues?.rw || ''} 
            placeholder="000" 
            className="font-mono h-11 sm:h-12 text-sm text-center" 
          />
        </div>
      </div>
    </div>
  );
}