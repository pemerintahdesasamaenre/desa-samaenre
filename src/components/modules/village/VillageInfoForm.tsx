'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { updateVillageInfo } from '@/actions/village-info';
import { Save, Loader2, Plus, Trash2 } from 'lucide-react';

interface VillageInfoFormProps {
  initialData: any;
}

export default function VillageInfoForm({ initialData }: VillageInfoFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // State untuk misi desa sebagai array of strings
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

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(event.currentTarget);
    const data = {
      name: formData.get('name') as string,
      vision: formData.get('vision') as string,
      mission: missions.filter(m => m.trim() !== ''), // Bersihkan misi kosong
      history: formData.get('history') as string,
      contact_info: {
        email: formData.get('email') as string,
        phone: formData.get('phone') as string,
        address: formData.get('address') as string,
        maps_url: formData.get('maps_url') as string,
      }
    };

    try {
      const result = await updateVillageInfo(initialData.id, data);
      if (result.error) {
        const errorMessages = Object.values(result.error).flat().join(', ');
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
    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
      <form onSubmit={handleSubmit} className="p-8 space-y-8">
        {error && (
          <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/30 text-red-600 dark:text-red-400 rounded-xl text-sm">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Nama Desa</label>
            <input 
              name="name" 
              defaultValue={initialData.name} 
              required
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 outline-none transition-all" 
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Email Kontak</label>
            <input 
              name="email" 
              type="email"
              defaultValue={initialData.contact_info?.email} 
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 outline-none transition-all" 
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Telepon</label>
            <input 
              name="phone" 
              defaultValue={initialData.contact_info?.phone} 
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 outline-none transition-all" 
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">URL Google Maps</label>
            <input 
              name="maps_url" 
              type="url"
              defaultValue={initialData.contact_info?.maps_url} 
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 outline-none transition-all" 
            />
          </div>
          <div className="space-y-2 md:col-span-2">
            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Alamat Kantor Desa</label>
            <textarea 
              name="address" 
              rows={2}
              defaultValue={initialData.contact_info?.address} 
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 outline-none transition-all" 
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Visi Desa</label>
          <textarea 
            name="vision" 
            rows={2}
            defaultValue={initialData.vision} 
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 outline-none transition-all" 
          />
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Misi Desa</label>
            <button 
              type="button"
              onClick={addMission}
              className="text-xs bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all"
            >
              <Plus size={14} />
              Tambah Misi
            </button>
          </div>
          
          <div className="space-y-3">
            {missions.map((mission, index) => (
              <div key={index} className="flex gap-2">
                <input 
                  value={mission}
                  onChange={(e) => updateMission(index, e.target.value)}
                  placeholder={`Misi ke-${index + 1}`}
                  className="flex-1 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm" 
                />
                <button 
                  type="button"
                  onClick={() => removeMission(index)}
                  className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
            {missions.length === 0 && (
              <p className="text-sm text-slate-400 dark:text-slate-500 italic">Belum ada misi yang ditambahkan.</p>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Sejarah Desa</label>
          <textarea 
            name="history" 
            rows={6}
            defaultValue={initialData.history} 
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 outline-none transition-all" 
          />
        </div>

        <div className="pt-6 border-t border-slate-100 dark:border-slate-800 flex justify-end">
          <button 
            type="submit" 
            disabled={loading}
            className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-blue-700 disabled:opacity-50 transition-all shadow-lg shadow-blue-200 dark:shadow-blue-900/20"
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
            Simpan Perubahan
          </button>
        </div>
      </form>
    </div>
  );
}
