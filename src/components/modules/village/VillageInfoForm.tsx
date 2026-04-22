'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { updateVillageInfo } from '@/actions/village-info';
import { Save, Loader2, Plus, Trash2, Globe, Info, HelpCircle, Map as MapIcon, Compass, History } from 'lucide-react';
import ImageUpload from '@/components/ui/ImageUpload';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { type VillageInfoInput } from '@/lib/validations';

interface FormerLeader {
  name: string;
  period: string;
}

interface VillageInfoFormProps {
  initialData: {
    id: number;
    name: string;
    vision?: string;
    mission?: string[];
    former_leaders?: FormerLeader[];
    history?: string;
    logo_url?: string;
    header_banner_url?: string;
    area_size?: string;
    boundaries?: {
      north?: string;
      south?: string;
      east?: string;
      west?: string;
    };
    contact_info?: {
      email?: string;
      phone?: string;
      address?: string;
      maps_url?: string;
    }
  };
}

export default function VillageInfoForm({ initialData }: VillageInfoFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [logoUrl, setLogoUrl] = useState(initialData.logo_url || '');
  const [bannerUrl, setBannerUrl] = useState(initialData.header_banner_url || '');
  const [mapsUrl, setMapsUrl] = useState(initialData.contact_info?.maps_url || '');
  const [phoneNumber, setPhoneNumber] = useState(initialData.contact_info?.phone || '');
  
  const [missions, setMissions] = useState<string[]>(
    Array.isArray(initialData.mission) ? initialData.mission : []
  );

  const [formerLeaders, setFormerLeaders] = useState<FormerLeader[]>(
    Array.isArray(initialData.former_leaders) ? initialData.former_leaders : []
  );

  const addMission = () => setMissions([...missions, '']);
  const removeMission = (index: number) => setMissions(missions.filter((_, i) => i !== index));
  const updateMission = (index: number, value: string) => {
    const newMissions = [...missions];
    newMissions[index] = value;
    setMissions(newMissions);
  };

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
      mission: missions.filter(m => m.trim() !== ''),
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
      } else {
        router.refresh();
        alert('Data desa berhasil diperbarui!');
      }
    } catch {
      setError('Terjadi kesalahan koneksi.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-card rounded-[3rem] shadow-sm border border-border overflow-hidden">
      <form onSubmit={handleSubmit} className="p-10 space-y-12">
        {error && (
          <div className="p-4 bg-destructive/10 border border-destructive/20 text-destructive rounded-2xl text-sm font-bold">
            {error}
          </div>
        )}

        {/* Section 1: Identity & Contact */}
        <section className="space-y-10">
          <div className="border-b border-border pb-6">
            <h2 className="text-xl font-black flex items-center gap-3 tracking-tight text-foreground uppercase">
              <div className="p-2 bg-primary/10 text-primary rounded-xl">
                <Globe size={24} />
              </div>
              Identitas & Kontak Desa
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="space-y-8">
              <div className="space-y-2">
                <Label>Nama Resmi Desa</Label>
                <Input 
                  name="name" 
                  defaultValue={initialData.name} 
                  required
                />
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Email Desa</Label>
                  <Input 
                    name="email" 
                    type="email"
                    defaultValue={initialData.contact_info?.email} 
                  />
                </div>
                <div className="space-y-2">
                  <Label>Nomor Telepon / WA</Label>
                  <Input 
                    type="text"
                    value={phoneNumber}
                    onChange={handlePhoneChange}
                    placeholder="08xxxxxxxxxx"
                  />
                </div>
              </div>

              <div className="space-y-2 group">
                <Label className="flex items-center gap-2">
                  Peta Lokasi Google Maps
                  <HelpCircle size={14} className="text-muted-foreground" />
                </Label>
                <Input 
                  value={mapsUrl}
                  onChange={handleMapsInputChange}
                  placeholder="Paste link atau kode iframe dari Google Maps"
                />
              </div>

              <div className="space-y-2">
                <Label>Alamat Kantor Desa</Label>
                <textarea 
                  name="address" 
                  rows={4}
                  defaultValue={initialData.contact_info?.address} 
                  className="w-full p-6 rounded-[2rem] border border-border bg-background text-foreground focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all resize-none font-medium leading-relaxed hover:border-primary/50" 
                />
              </div>
            </div>

            <div className="space-y-8">
              <ImageUpload label="Logo Resmi Desa" folder="branding" value={logoUrl} onChange={setLogoUrl} />
              <ImageUpload label="Banner Halaman Utama" folder="branding" value={bannerUrl} onChange={setBannerUrl} />
            </div>
          </div>
        </section>

        {/* Section 2: Geography & Boundaries */}
        <section className="space-y-10">
          <div className="border-b border-border pb-6">
            <h2 className="text-xl font-black flex items-center gap-3 tracking-tight text-foreground uppercase">
              <div className="p-2 bg-emerald-500/10 text-emerald-500 rounded-xl">
                <MapIcon size={24} />
              </div>
              Geografis & Batas Wilayah
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="space-y-2">
              <Label>Luas Wilayah (km² / Ha)</Label>
              <Input 
                name="area_size" 
                defaultValue={initialData.area_size} 
                placeholder="Contoh: 12.5 km²"
              />
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="text-muted-foreground flex items-center gap-2">
                  <Compass size={12} /> Utara
                </Label>
                <Input 
                  name="boundary_north" 
                  defaultValue={initialData.boundaries?.north} 
                />
              </div>
              <div className="space-y-2">
                <Label className="text-muted-foreground flex items-center gap-2">
                  <Compass size={12} /> Selatan
                </Label>
                <Input 
                  name="boundary_south" 
                  defaultValue={initialData.boundaries?.south} 
                />
              </div>
              <div className="space-y-2">
                <Label className="text-muted-foreground flex items-center gap-2">
                  <Compass size={12} /> Timur
                </Label>
                <Input 
                  name="boundary_east" 
                  defaultValue={initialData.boundaries?.east} 
                />
              </div>
              <div className="space-y-2">
                <Label className="text-muted-foreground flex items-center gap-2">
                  <Compass size={12} /> Barat
                </Label>
                <Input 
                  name="boundary_west" 
                  defaultValue={initialData.boundaries?.west} 
                />
              </div>
            </div>
          </div>
        </section>

        {/* Section 3: Vision, Mission & Leaders */}
        <section className="space-y-10">
          <div className="border-b border-border pb-6">
            <h2 className="text-xl font-black flex items-center gap-3 tracking-tight text-foreground uppercase">
              <div className="p-2 bg-primary/10 text-primary rounded-xl">
                <Info size={24} />
              </div>
              Visi, Misi & Kepemimpinan
            </h2>
          </div>

          <div className="space-y-10">
            <div className="space-y-2">
              <Label>Visi Desa</Label>
              <textarea name="vision" rows={2} defaultValue={initialData.vision} className="w-full p-6 rounded-[2rem] border border-border bg-background text-foreground focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all resize-none font-bold text-lg tracking-tight hover:border-primary/50" />
            </div>

            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <Label>Misi Desa</Label>
                <button type="button" onClick={addMission} className="text-[10px] bg-primary text-primary-foreground px-6 py-2.5 rounded-full flex items-center gap-2 transition-all font-black uppercase tracking-widest shadow-lg shadow-primary/20 active:scale-95">
                  <Plus size={14} /> Tambah Misi
                </button>
              </div>
              <div className="space-y-4">
                {missions.map((mission, index) => (
                  <div key={index} className="flex gap-3">
                    <Input value={mission} onChange={(e) => updateMission(index, e.target.value)} placeholder={`Tulis misi ke-${index + 1}`} />
                    <button type="button" onClick={() => removeMission(index)} className="p-4 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-2xl transition-all border border-transparent hover:border-destructive/20">
                      <Trash2 size={20} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-6 pt-6 border-t border-border">
              <div className="flex items-center justify-between">
                <Label>Daftar Mantan Kepala Desa</Label>
                <button type="button" onClick={addLeader} className="text-[10px] bg-secondary text-secondary-foreground px-6 py-2.5 rounded-full flex items-center gap-2 transition-all font-black uppercase tracking-widest shadow-lg active:scale-95">
                  <Plus size={14} /> Tambah Mantan Kades
                </button>
              </div>
              <div className="space-y-4">
                {formerLeaders.map((leader, index) => (
                  <div key={index} className="grid grid-cols-1 md:grid-cols-12 gap-3 p-4 bg-muted/30 rounded-[2rem] border border-border">
                    <div className="md:col-span-7">
                      <Input value={leader.name} onChange={(e) => updateLeader(index, 'name', e.target.value)} placeholder="Nama Lengkap Kades" />
                    </div>
                    <div className="md:col-span-4">
                      <Input value={leader.period} onChange={(e) => updateLeader(index, 'period', e.target.value)} placeholder="Periode (Contoh: 2010 - 2016)" />
                    </div>
                    <div className="md:col-span-1 flex justify-end">
                      <button type="button" onClick={() => removeLeader(index)} className="p-3 text-muted-foreground hover:text-destructive transition-colors">
                        <Trash2 size={20} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2 pt-6 border-t border-border">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-primary/10 text-primary rounded-xl">
                  <History size={18} />
                </div>
                <Label>Sejarah Lengkap Desa</Label>
              </div>
              <textarea name="history" rows={10} defaultValue={initialData.history} className="w-full p-8 rounded-[2rem] border border-border bg-background text-foreground focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all resize-none font-medium leading-relaxed hover:border-primary/50" />
            </div>
          </div>
        </section>

        <div className="pt-10 border-t border-border flex justify-end">
          <button type="submit" disabled={loading} className="w-full sm:w-auto bg-primary text-primary-foreground px-12 py-5 rounded-full font-black flex items-center justify-center gap-4 hover:opacity-90 disabled:opacity-50 transition-all shadow-2xl shadow-primary/30 active:scale-95 text-sm uppercase tracking-widest">
            {loading ? <Loader2 className="animate-spin" size={24} /> : <Save size={24} />}
            Simpan Seluruh Perubahan
          </button>
        </div>
      </form>
    </div>
  );
}
