import { getVillageInfo } from '@/services/data-service';
import { updateVillageInfo } from '@/actions/village-info';
import { Save } from 'lucide-react';

export default async function AdminContentPage() {
  const villageInfo = await getVillageInfo();

  async function handleSubmit(formData: FormData) {
    'use server'
    const id = Number(formData.get('id'));
    const data = {
      name: formData.get('name'),
      vision: formData.get('vision'),
      mission: JSON.parse(formData.get('mission') as string || '[]'),
      history: formData.get('history'),
      contact_info: {
        email: formData.get('email'),
        phone: formData.get('phone'),
        address: formData.get('address'),
      }
    };
    await updateVillageInfo(id, data);
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Kelola Konten Desa</h1>
        <p className="text-slate-500 mt-2">Perbarui profil umum, visi, misi, dan sejarah desa Anda.</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <form action={handleSubmit} className="p-8 space-y-6">
          <input type="hidden" name="id" value={villageInfo.id || 1} />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Nama Desa</label>
              <input 
                name="name" 
                defaultValue={villageInfo.name} 
                className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none" 
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Email Kontak</label>
              <input 
                name="email" 
                defaultValue={villageInfo.contact_info?.email} 
                className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none" 
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Visi Desa</label>
            <textarea 
              name="vision" 
              rows={2}
              defaultValue={villageInfo.vision} 
              className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none" 
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Misi Desa (Format JSON Array)</label>
            <textarea 
              name="mission" 
              rows={4}
              defaultValue={JSON.stringify(villageInfo.mission, null, 2)} 
              className="w-full px-4 py-2 font-mono text-sm rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none" 
            />
            <p className="text-xs text-slate-400">Contoh: ["Misi 1", "Misi 2"]</p>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Sejarah Desa</label>
            <textarea 
              name="history" 
              rows={6}
              defaultValue={villageInfo.history} 
              className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none" 
            />
          </div>

          <div className="pt-4 border-t border-slate-100 flex justify-end">
            <button 
              type="submit" 
              className="bg-blue-600 text-white px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:bg-blue-700 transition-all shadow-lg shadow-blue-200"
            >
              <Save size={20} />
              Simpan Perubahan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
