'use client';

import { Map as MapIcon } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface GeographySectionProps {
  initialData: {
    area_size?: string | null;
    boundaries?: {
      north?: string | null;
      south?: string | null;
      east?: string | null;
      west?: string | null;
    } | null;
  };
}

export default function GeographySection({ initialData }: GeographySectionProps) {
  return (
    <section className="space-y-6 sm:space-y-10 pt-4 sm:pt-6 border-t border-border">
      <div className="flex items-center gap-3 border-b border-border pb-4">
         <div className="p-1.5 sm:p-2 bg-primary/10 text-primary rounded-lg">
           <MapIcon size={20} />
         </div>
         <h3 className="text-xs sm:text-sm font-bold uppercase tracking-[0.2em]">Geografis & Batas</h3>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-10">
         <div className="space-y-2">
            <Label>Luas Wilayah</Label>
            <Input name="area_size" defaultValue={initialData.area_size || ''} placeholder="KM2 / Ha" className="h-11 sm:h-12 text-sm" />
         </div>
         <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
               <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Utara</Label>
               <Input name="boundary_north" defaultValue={initialData.boundaries?.north || ''} placeholder="Batas Utara" className="h-11 text-xs" />
            </div>
            <div className="space-y-2">
               <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Selatan</Label>
               <Input name="boundary_south" defaultValue={initialData.boundaries?.south || ''} placeholder="Batas Selatan" className="h-11 text-xs" />
            </div>
            <div className="space-y-2">
               <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Timur</Label>
               <Input name="boundary_east" defaultValue={initialData.boundaries?.east || ''} placeholder="Batas Timur" className="h-11 text-xs" />
            </div>
            <div className="space-y-2">
               <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Barat</Label>
               <Input name="boundary_west" defaultValue={initialData.boundaries?.west || ''} placeholder="Batas Barat" className="h-11 text-xs" />
            </div>
         </div>
      </div>
    </section>
  );
}
