'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { updateVillageInfo } from '@/actions/village-info';
import { Save, Loader2, Plus, Trash2, Globe, Info, HelpCircle } from 'lucide-react';
import ImageUpload from '@/components/ui/ImageUpload';

interface VillageInfoFormProps {
  initialData: any;
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

  const addMission = () => setMissions([...missions, '']);
  const removeMission = (index: number) => setMissions(missions.filter((_, i) => i !== index));
  const updateMission = (index: number, value: string) => {
    const newMissions = [...missions];
    newMissions[index] = value;
    setMissions(newMissions);
  };

  // FUNGSI PEMBERSIH NOMOR TELEPON (Mitigasi Admin Paste Format Berantakan)
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value;
    
    // 1. Ambil hanya angka saja
    let cleaned = val.replace(/\D/g, '');
    
    // 2. Mitigasi jika user memasukkan kode negara dengan tanda + (misal: +62)
    // Karakter '+' sudah hilang karena regex \D, jadi kita hanya cek angka depannya
    if (val.startsWith('+62')) cleaned = '62' + cleaned.substring(2);
    
    setPhoneNumber(cleaned);
  };

  const handleMapsInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let input = e.target.value.trim();
    if (!input) { setMapsUrl(''); return; }
    if (input.includes('<iframe')) {
      const srcMatch = input.match(/src="([^"]+)"/);
      if (srcMatch && srcMatch[1]) {
        setMapsUrl(srcMatch[1]);
        return;
      }
    }
    setMapsUrl(input);
  };

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(event.currentTarget);
    const data = {
      name: formData.get('name') as string,
      vision: formData.get('vision') as string,
      mission: missions.filter(m => m.trim() !== ''),
      history: formData.get('history') as string,
      logo_url: logoUrl,
      header_banner_url: bannerUrl,
      contact_info: {
        email: formData.get('email') as string,
        phone: phoneNumber, // Gunakan nomor yang sudah dibersihkan
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
    } catch (err) {
      setError('Terjadi kesalahan koneksi.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden font-sans">
      <form onSubmit={handleSubmit} className="p-5 md:p-8 space-y-8 text-slate-900 dark:text-slate-100">
        {error && (
          <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/30 text-red-600 dark:text-red-400 rounded-xl text-sm">
            {error}
          </div>
        )}

        <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
          <h2 className="text-xl font-black flex items-center gap-2 tracking-tight">
            <Globe className="text-blue-600" size={24} />
            Identitas & Kontak Desa
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Nama Desa</label>
              <input 
                name="name" 
                defaultValue={initialData.name} 
                required
                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 outline-none transition-all" 
              />
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Email Desa</label>
                <input 
                  name="email" 
                  type="email"
                  defaultValue={initialData.contact_info?.email} 
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-blue-500 outline-none transition-all" 
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Nomor Telepon / WA</label>
                <input 
                  type="text"
                  value={phoneNumber}
                  onChange={handlePhoneChange}
                  placeholder="Contoh: 081234567890"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 outline-none transition-all font-mono" 
                />
                <p className="text-[10px] text-slate-500 italic">Format akan otomatis dibersihkan (angka saja).</p>
              </div>
            </div>

            <div className="space-y-2 group">
              <label className="text-sm font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                Peta Lokasi Google Maps
                <HelpCircle size={14} className="text-slate-400 group-hover:text-blue-500 transition-colors" />
              </label>
              <input 
                value={mapsUrl}
                onChange={handleMapsInputChange}
                placeholder="Paste link atau kode dari Google Maps"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 outline-none transition-all" 
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Alamat Lengkap Kantor Desa</label>
              <textarea 
                name="address" 
                rows={3}
                defaultValue={initialData.contact_info?.address} 
                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 outline-none transition-all resize-none" 
              />
            </div>
          </div>

          <div className="space-y-6">
            <ImageUpload label="Logo Resmi Desa" folder="branding" value={logoUrl} onChange={setLogoUrl} />
            <ImageUpload label="Banner Halaman Utama" folder="branding" value={bannerUrl} onChange={setBannerUrl} />
          </div>
        </div>

        <div className="border-b border-slate-100 dark:border-slate-800 pt-4 pb-4">
          <h2 className="text-xl font-black flex items-center gap-2 tracking-tight">
            <Info className="text-blue-600" size={24} />
            Visi, Misi & Sejarah
          </h2>
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Visi Desa</label>
            <textarea name="vision" rows={2} defaultValue={initialData.vision} className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 outline-none transition-all resize-none" />
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Misi Desa</label>
              <button type="button" onClick={addMission} className="text-xs bg-blue-600 text-white hover:bg-blue-700 px-4 py-2 rounded-xl flex items-center gap-1.5 transition-all font-bold shadow-lg shadow-blue-500/20">
                <Plus size={14} /> TAMBAH MISI
              </button>
            </div>
            <div className="space-y-3">
              {missions.map((mission, index) => (
                <div key={index} className="flex gap-2">
                  <input value={mission} onChange={(e) => updateMission(index, e.target.value)} placeholder={`Misi ke-${index + 1}`} className="flex-1 px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm font-medium" />
                  <button type="button" onClick={() => removeMission(index)} className="p-3 text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors">
                    <Trash2 size={20} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Sejarah Lengkap Desa</label>
            <textarea name="history" rows={10} defaultValue={initialData.history} className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 outline-none transition-all resize-none font-medium leading-relaxed" />
          </div>
        </div>

        <div className="pt-8 border-t border-slate-100 dark:border-slate-800 flex justify-end">
          <button type="submit" disabled={loading} className="w-full sm:w-auto bg-blue-600 text-white px-12 py-4 rounded-2xl font-black flex items-center justify-center gap-3 hover:bg-blue-700 hover:scale-105 disabled:opacity-50 disabled:scale-100 transition-all shadow-2xl shadow-blue-500/40 tracking-tighter">
            {loading ? <Loader2 className="animate-spin" size={24} /> : <Save size={24} />}
            SIMPAN SELURUH PERUBAHAN
          </button>
        </div>
      </form>
    </div>
  );
}
