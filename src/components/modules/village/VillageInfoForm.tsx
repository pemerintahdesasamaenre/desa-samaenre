'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { updateVillageInfo } from '@/actions/village-info';
import { Save, Loader2, Trash2, Globe, Info, HelpCircle, Map as MapIcon, History, Plus, ChevronDown, ChevronUp } from 'lucide-react';
import ImageUpload from '@/components/ui/ImageUpload';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { type VillageInfoInput } from '@/lib/validations';
import { toast } from 'sonner';

interface FormerLeader {
  name: string;
  period: string;
}

interface MissionSection {
  title: string;
  items: string[];
}

interface VillageInfoFormProps {
  initialData: {
    id: number;
    name: string;
    vision?: string | null;
    mission?: MissionSection[] | string[] | null;
    former_leaders?: FormerLeader[] | null;
    history?: string | null;
    logo_url?: string | null;
    header_banner_url?: string | null;
    area_size?: string | null;
    boundaries?: {
      north?: string | null;
      south?: string | null;
      east?: string | null;
      west?: string | null;
    } | null;
    contact_info?: {
      email?: string | null;
      phone?: string | null;
      address?: string | null;
      maps_url?: string | null;
    } | null;
  };
}

function parseMissions(raw: MissionSection[] | string[] | null | undefined): MissionSection[] {
  if (!Array.isArray(raw) || raw.length === 0) return [];
  if (typeof raw[0] === 'string') {
    // Legacy flat string[] → convert to sections
    return (raw as string[]).map(s => ({ title: s, items: [] }));
  }
  return raw as MissionSection[];
}

export default function VillageInfoForm({ initialData }: VillageInfoFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [logoUrl, setLogoUrl] = useState(initialData.logo_url || '');
  const [bannerUrl, setBannerUrl] = useState(initialData.header_banner_url || '');
  const [mapsUrl, setMapsUrl] = useState(initialData.contact_info?.maps_url || '');
  const [phoneNumber, setPhoneNumber] = useState(initialData.contact_info?.phone || '');
  
  const [missionSections, setMissionSections] = useState<MissionSection[]>(
    parseMissions(initialData.mission)
  );

  const [expandedSections, setExpandedSections] = useState<number[]>(
    missionSections.map((_, i) => i)
  );

  const [formerLeaders, setFormerLeaders] = useState<FormerLeader[]>(
    Array.isArray(initialData.former_leaders) ? initialData.former_leaders : []
  );

  // --- Mission Section Handlers ---
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

  // --- Former Leaders ---
  const addLeader = () => setFormerLeaders([...formerLeaders, { name: '', period: '' }]);
  const removeLeader = (index: number) => setFormerLeaders(formerLeaders.filter((_, i) => i !== index));
  const updateLeader = (index: number, field: keyof FormerLeader, value: string) => {
    const newLeaders = [...formerLeaders];
    newLeaders[index] = { ...newLeaders[index], [field]: value };
    setFormerLeaders(newLeaders);
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    let cleaned = val.replace(/\D/g, '');
    if (val.startsWith('+62')) cleaned = '62' + cleaned.substring(2);
    setPhoneNumber(cleaned);
  };

  const handleMapsInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const trimmedInput = e.target.value.trim();
    if (!trimmedInput) { 
      setMapsUrl(''); 
      return; 
    }
    if (trimmedInput.includes('<iframe')) {
      const srcMatch = trimmedInput.match(/src="([^"]+)"/);
      if (srcMatch && srcMatch[1]) {
        setMapsUrl(srcMatch[1]);
        return;
      }
    }
    setMapsUrl(trimmedInput);
  };

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(event.currentTarget);
    const data: VillageInfoInput = {
      name: formData.get('name') as string,
      vision: formData.get('vision') as string,
      mission: missionSections.filter(s => s.title.trim() !== '').map(s => ({
        title: s.title,
        items: s.items.filter(item => item.trim() !== ''),
      })),
      former_leaders: formerLeaders.filter(l => l.name.trim() !== '' && l.period.trim() !== ''),
      history: formData.get('history') as string,
      logo_url: logoUrl,
      header_banner_url: bannerUrl,
      area_size: formData.get('area_size') as string,
      boundaries: {
        north: formData.get('boundary_north') as string,
        south: formData.get('boundary_south') as string,
        east: formData.get('boundary_east') as string,
        west: formData.get('boundary_west') as string,
      },
      contact_info: {
        email: formData.get('email') as string,
        phone: phoneNumber, 
        address: formData.get('address') as string,
        maps_url: mapsUrl, 
      }
    };

    try {
      const result = await updateVillageInfo(initialData.id, data);
      if (result.error) {
        const errorMessages = typeof result.error === 'string' 
          ? result.error 
          : Object.values(result.error).flat().join(', ');
        setError(errorMessages || 'Gagal memvalidasi data.');
        toast.error('Gagal memperbarui informasi desa.', { id: toastId });
      } else {
        toast.success('Informasi desa berhasil diperbarui!', { id: toastId });
        router.refresh();
      }
    } catch {
      setError('Kesalahan koneksi.');
      toast.error('Kesalahan koneksi ke server', { id: toastId });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-card rounded-2xl sm:rounded-[3rem] shadow-sm border border-border overflow-hidden">
      <form onSubmit={handleSubmit} className="p-5 sm:p-10 space-y-8 sm:space-y-12">
        {error && (
          <div className="p-3 sm:p-4 bg-destructive/10 border border-destructive/20 text-destructive rounded-xl text-xs sm:text-sm font-bold">
            {error}
          </div>
        )}

        {/* Identity & Contact */}
        <section className="space-y-6 sm:space-y-10">
          <div className="border-b border-border pb-4 sm:pb-6 flex items-center gap-3">
             <div className="p-1.5 sm:p-2 bg-primary/10 text-primary rounded-lg sm:rounded-xl">
               <Globe size={20} />
             </div>
             <h2 className="text-sm sm:text-xl font-bold uppercase tracking-tight text-foreground">Identitas & Kontak</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-10">
            <div className="space-y-6 sm:space-y-8">
              <div className="space-y-2">
                <Label>Nama Resmi Desa</Label>
                <Input name="name" defaultValue={initialData.name || ''} required className="h-11 sm:h-12 text-sm" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input name="email" type="email" defaultValue={initialData.contact_info?.email || ''} className="h-11 sm:h-12 text-sm" />
                </div>
                <div className="space-y-2">
                  <Label>Nomor Telepon</Label>
                  <Input type="text" value={phoneNumber} onChange={handlePhoneChange} className="h-11 sm:h-12 text-sm" />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="flex items-center gap-2">Google Maps <HelpCircle size={12} /></Label>
                <Input value={mapsUrl} onChange={handleMapsInputChange} placeholder="Link Iframe Maps" className="h-11 sm:h-12 text-sm" />
              </div>
              <div className="space-y-2">
                <Label>Alamat Kantor</Label>
                <textarea 
                  name="address" 
                  rows={3}
                  defaultValue={initialData.contact_info?.address || ''} 
                  className="w-full p-4 rounded-xl sm:rounded-[2rem] border border-border bg-background text-sm font-medium resize-none outline-none focus:ring-4 focus:ring-primary/10 transition-all" 
                />
              </div>
            </div>
            <div className="space-y-6 sm:space-y-8">
              <ImageUpload label="Logo Desa" folder="branding" value={logoUrl} onChange={setLogoUrl} />
              <ImageUpload label="Banner Header" folder="branding" value={bannerUrl} onChange={setBannerUrl} />
            </div>
          </div>
        </section>

        {/* Geography */}
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
                <Input name="boundary_north" defaultValue={initialData.boundaries?.north || ''} placeholder="Utara" className="h-11 text-xs" />
                <Input name="boundary_south" defaultValue={initialData.boundaries?.south || ''} placeholder="Selatan" className="h-11 text-xs" />
                <Input name="boundary_east" defaultValue={initialData.boundaries?.east || ''} placeholder="Timur" className="h-11 text-xs" />
                <Input name="boundary_west" defaultValue={initialData.boundaries?.west || ''} placeholder="Barat" className="h-11 text-xs" />
             </div>
          </div>
        </section>

        {/* Vision & Mission */}
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
                <textarea name="vision" rows={2} defaultValue={initialData.vision || ''} className="w-full p-4 rounded-xl border border-border bg-background text-sm font-bold resize-none outline-none focus:ring-4 focus:ring-primary/10 transition-all" />
             </div>

             {/* Hierarchical Mission Sections */}
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
                      {/* Section Header */}
                      <div className="flex items-center gap-2 p-3 bg-muted/40">
                        <span className="w-6 h-6 rounded-full bg-primary text-primary-foreground text-[10px] font-bold flex items-center justify-center shrink-0">
                          {secIdx + 1}
                        </span>
                        <Input
                          value={section.title}
                          onChange={e => updateSectionTitle(secIdx, e.target.value)}
                          placeholder="Judul seksi misi (contoh: Peningkatan Sektor Agama)"
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

                      {/* Section Items */}
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

        {/* History */}
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
                <textarea name="history" rows={6} defaultValue={initialData.history || ''} className="w-full p-4 rounded-xl border border-border bg-background text-sm leading-relaxed outline-none focus:ring-4 focus:ring-primary/10 transition-all" />
             </div>
             <div className="space-y-4">
                <div className="flex items-center justify-between">
                   <Label>Mantan Kepala Desa</Label>
                   <button type="button" onClick={addLeader} className="text-[10px] bg-muted text-foreground px-4 py-1.5 rounded-full font-bold uppercase tracking-widest active:scale-95 border border-border">Tambah Tokoh</button>
                </div>
                {formerLeaders.map((l, i) => (
                  <div key={i} className="grid grid-cols-1 sm:grid-cols-12 gap-2 p-3 bg-muted/30 rounded-xl border border-border">
                    <div className="sm:col-span-7">
                      <Input value={l.name} onChange={(e) => updateLeader(i, 'name', e.target.value)} placeholder="Nama" className="h-10 text-xs" />
                    </div>
                    <div className="sm:col-span-4">
                      <Input value={l.period} onChange={(e) => updateLeader(i, 'period', e.target.value)} placeholder="Periode (cth: 1965)" className="h-10 text-xs text-center" />
                    </div>
                    <div className="sm:col-span-1 flex justify-end">
                       <button type="button" onClick={() => removeLeader(i)} className="p-2 text-destructive"><Trash2 size={16} /></button>
                    </div>
                  </div>
                ))}
             </div>
          </div>
        </section>

        <div className="pt-6 sm:pt-10 border-t border-border flex justify-end">
          <button type="submit" disabled={loading} className="w-full sm:w-auto bg-primary text-primary-foreground px-10 py-4 rounded-full font-bold flex items-center justify-center gap-3 hover:opacity-90 disabled:opacity-50 transition-all shadow-lg text-[10px] sm:text-sm tracking-widest uppercase active:scale-95">
            {loading ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
            Simpan Seluruh Perubahan
          </button>
        </div>
      </form>
    </div>
  );
}
