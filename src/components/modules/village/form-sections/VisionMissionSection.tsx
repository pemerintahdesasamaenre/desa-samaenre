'use client';

import { Info, Plus, ChevronDown, ChevronUp, Trash2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useState } from 'react';

interface MissionSection {
  title: string;
  items: string[];
}

interface VisionMissionSectionProps {
  initialVision?: string | null | undefined;
  missionSections: MissionSection[];
  setMissionSections: (sections: MissionSection[]) => void;
}

export default function VisionMissionSection({
  initialVision,
  missionSections,
  setMissionSections
}: VisionMissionSectionProps) {
  
  const [expandedSections, setExpandedSections] = useState<number[]>(
    missionSections.map((_, i) => i)
  );

  const addSection = () => {
    const newIdx = missionSections.length;
    setMissionSections([...missionSections, { title: '', items: [''] }]);
    setExpandedSections(prev => [...prev, newIdx]);
  };

  const removeSection = (idx: number) => {
    setMissionSections(missionSections.filter((_, i) => i !== idx));
    setExpandedSections(prev => prev.filter(i => i !== idx).map(i => i > idx ? i - 1 : i));
  };

  const updateSectionTitle = (idx: number, value: string) => {
    const s = [...missionSections];
    s[idx] = { ...s[idx], title: value };
    setMissionSections(s);
  };

  const addItem = (secIdx: number) => {
    const s = [...missionSections];
    s[secIdx] = { ...s[secIdx], items: [...s[secIdx].items, ''] };
    setMissionSections(s);
  };

  const removeItem = (secIdx: number, itemIdx: number) => {
    const s = [...missionSections];
    s[secIdx] = { ...s[secIdx], items: s[secIdx].items.filter((_, i) => i !== itemIdx) };
    setMissionSections(s);
  };

  const updateItem = (secIdx: number, itemIdx: number, value: string) => {
    const s = [...missionSections];
    const items = [...s[secIdx].items];
    items[itemIdx] = value;
    s[secIdx] = { ...s[secIdx], items };
    setMissionSections(s);
  };

  const toggleSection = (idx: number) => {
    setExpandedSections(prev =>
      prev.includes(idx) ? prev.filter(i => i !== idx) : [...prev, idx]
    );
  };

  return (
    <section className="space-y-6 sm:space-y-10 pt-4 sm:pt-6 border-t border-border">
      <div className="flex items-center gap-3 border-b border-border pb-4">
         <div className="p-1.5 sm:p-2 bg-primary/10 text-primary rounded-lg">
           <Info size={20} />
         </div>
         <h3 className="text-xs sm:text-sm font-bold uppercase tracking-[0.2em]">Visi & Misi</h3>
      </div>
      <div className="space-y-6">
         <div className="space-y-2">
            <Label>Visi Desa</Label>
            <textarea 
              name="vision" 
              rows={2} 
              defaultValue={initialVision || ''} 
              className="w-full p-4 rounded-xl border border-border bg-background text-sm font-bold resize-none outline-none focus:ring-4 focus:ring-primary/10 transition-all" 
            />
         </div>

         <div className="space-y-3">
            <div className="flex items-center justify-between">
               <Label>Daftar Misi (Seksi & Sub-Item)</Label>
               <button
                 type="button"
                 onClick={addSection}
                 className="flex items-center gap-1.5 text-[10px] bg-primary text-primary-foreground px-4 py-1.5 rounded-full font-bold uppercase tracking-widest active:scale-95 hover:opacity-90"
               >
                 <Plus size={12} /> Tambah Seksi Misi
               </button>
            </div>

            <div className="space-y-3">
              {missionSections.map((section, secIdx) => (
                <div key={secIdx} className="rounded-2xl border border-border bg-muted/20 overflow-hidden">
                  <div className="flex items-center gap-2 p-3 bg-muted/40">
                    <span className="w-6 h-6 rounded-full bg-primary text-primary-foreground text-[10px] font-bold flex items-center justify-center shrink-0">
                      {secIdx + 1}
                    </span>
                    <Input
                      value={section.title}
                      onChange={e => updateSectionTitle(secIdx, e.target.value)}
                      placeholder="Judul seksi misi"
                      className="h-9 text-sm font-bold flex-1"
                    />
                    <button
                      type="button"
                      onClick={() => toggleSection(secIdx)}
                      className="p-1.5 text-muted-foreground hover:text-primary rounded-lg"
                    >
                      {expandedSections.includes(secIdx) ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </button>
                    <button
                      type="button"
                      onClick={() => removeSection(secIdx)}
                      className="p-1.5 text-destructive hover:bg-destructive/10 rounded-lg"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>

                  {expandedSections.includes(secIdx) && (
                    <div className="p-3 space-y-2 border-t border-border/50">
                      {section.items.map((item, itemIdx) => (
                        <div key={itemIdx} className="flex items-center gap-2 pl-3">
                          <span className="text-muted-foreground text-xs shrink-0">•</span>
                          <Input
                            value={item}
                            onChange={e => updateItem(secIdx, itemIdx, e.target.value)}
                            placeholder={`Sub-item ${itemIdx + 1}...`}
                            className="h-9 text-sm flex-1"
                          />
                          <button
                            type="button"
                            onClick={() => removeItem(secIdx, itemIdx)}
                            className="p-1.5 text-destructive/60 hover:text-destructive hover:bg-destructive/10 rounded-lg shrink-0"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={() => addItem(secIdx)}
                        className="ml-6 flex items-center gap-1.5 text-[10px] text-primary font-bold uppercase tracking-widest hover:underline py-1"
                      >
                        <Plus size={11} /> Tambah Sub-Item
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
         </div>
      </div>
    </section>
  );
}