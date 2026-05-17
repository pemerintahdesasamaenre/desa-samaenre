'use client';

import { History, Trash2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface FormerLeader {
  name: string;
  period: string;
  note?: string;
  role_title?: string;
}

interface HistoryLeadershipSectionProps {
  initialHistory?: string | null | undefined;
  formerLeaders: FormerLeader[];
  setFormerLeaders: (leaders: FormerLeader[]) => void;
}

export default function HistoryLeadershipSection({
  initialHistory,
  formerLeaders,
  setFormerLeaders
}: HistoryLeadershipSectionProps) {
  
  const addLeader = () => setFormerLeaders([...formerLeaders, { name: '', period: '', note: '', role_title: 'Aparatur Berjasa' }]);
  const removeLeader = (index: number) => setFormerLeaders(formerLeaders.filter((_, i) => i !== index));
  const updateLeader = (index: number, field: keyof FormerLeader, value: string) => {
    const newLeaders = [...formerLeaders];
    newLeaders[index] = { ...newLeaders[index], [field]: value };
    setFormerLeaders(newLeaders);
  };

  return (
    <section className="space-y-6 sm:space-y-10 pt-4 sm:pt-6 border-t border-border">
      <div className="flex items-center gap-3 border-b border-border pb-4">
         <div className="p-1.5 sm:p-2 bg-primary/10 text-primary rounded-lg">
           <History size={20} />
         </div>
         <h3 className="text-xs sm:text-sm font-bold uppercase tracking-[0.2em]">Sejarah & Kepemimpinan</h3>
      </div>
      <div className="space-y-6">
         <div className="space-y-2">
            <Label>Sejarah Desa</Label>
            <textarea 
              name="history" 
              rows={6} 
              defaultValue={initialHistory || ''} 
              className="w-full p-4 rounded-xl border border-border bg-background text-sm leading-relaxed outline-none focus:ring-4 focus:ring-primary/10 transition-all" 
            />
         </div>
         <div className="space-y-4">
            <div className="flex items-center justify-between">
               <Label>Mantan Kepala Desa / Tokoh</Label>
               <button 
                 type="button" 
                 onClick={addLeader} 
                 className="text-[10px] bg-muted text-foreground px-4 py-1.5 rounded-full font-bold uppercase tracking-widest active:scale-95 border border-border"
               >
                 Tambah Tokoh
               </button>
            </div>
            <div className="space-y-3">
              {formerLeaders.map((l, i) => (
                <div key={i} className="p-4 bg-muted/30 rounded-2xl border border-border space-y-3 relative group">
                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                    <div className="sm:col-span-5">
                       <Label className="text-[10px] uppercase tracking-widest text-muted-foreground ml-1 mb-1.5 block">Nama Tokoh</Label>
                       <Input value={l.name || ''} onChange={(e) => updateLeader(i, 'name', e.target.value)} placeholder="Nama Lengkap" className="h-10 text-xs" />
                    </div>
                    <div className="sm:col-span-3">
                       <Label className="text-[10px] uppercase tracking-widest text-muted-foreground ml-1 mb-1.5 block">Periode</Label>
                       <Input value={l.period || ''} onChange={(e) => updateLeader(i, 'period', e.target.value)} placeholder="cth: 2013 - 2019" className="h-10 text-xs text-center" />
                    </div>
                    <div className="sm:col-span-3">
                       <Label className="text-[10px] uppercase tracking-widest text-muted-foreground ml-1 mb-1.5 block">Jabatan / Label</Label>
                       <Input value={l.role_title || ''} onChange={(e) => updateLeader(i, 'role_title', e.target.value)} placeholder="cth: Aparatur Berjasa" className="h-10 text-xs" />
                    </div>
                    <div className="sm:col-span-1 flex items-end justify-end pb-1">
                       <button type="button" onClick={() => removeLeader(i)} className="p-2 text-destructive hover:bg-destructive/10 rounded-lg transition-colors"><Trash2 size={16} /></button>
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-[10px] uppercase tracking-widest text-muted-foreground ml-1">Catatan / Keterangan Singkat</Label>
                    <textarea 
                       value={l.note || ''} 
                       onChange={(e) => updateLeader(i, 'note', e.target.value)}
                       placeholder="Tuliskan kontribusi atau catatan singkat mengenai tokoh ini..."
                       className="w-full p-3 rounded-xl border border-border bg-background text-[11px] leading-relaxed outline-none focus:ring-4 focus:ring-primary/10 transition-all min-h-[80px]"
                    />
                  </div>
                </div>
              ))}
            </div>
         </div>
      </div>
    </section>
  );
}