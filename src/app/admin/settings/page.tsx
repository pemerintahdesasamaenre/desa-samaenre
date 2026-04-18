import { createClient } from '@/lib/supabase/server';
import { Save, User, Shield, Key } from 'lucide-react';
import { revalidatePath } from 'next/cache';

export default async function SettingsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user?.id)
    .single();

  async function updateProfile(formData: FormData) {
    'use server'
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    const full_name = formData.get('full_name') as string;
    
    await supabase
      .from('profiles')
      .update({ full_name, updated_at: new Date().toISOString() })
      .eq('id', user?.id);
      
    revalidatePath('/admin/settings');
  }

  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Pengaturan</h1>
        <p className="text-slate-500 mt-2">Kelola akun admin dan konfigurasi keamanan Anda.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1 space-y-4">
          <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
              <User size={24} />
            </div>
            <div>
              <div className="text-sm font-bold text-slate-900">Profil Saya</div>
              <div className="text-xs text-slate-500">Data personal admin</div>
            </div>
          </div>
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center gap-4 opacity-60 grayscale cursor-not-allowed">
            <div className="w-12 h-12 rounded-full bg-slate-200 flex items-center justify-center text-slate-400">
              <Key size={24} />
            </div>
            <div>
              <div className="text-sm font-bold text-slate-400">Keamanan</div>
              <div className="text-xs text-slate-400">Ganti password</div>
            </div>
          </div>
        </div>

        <div className="md:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-6 border-b border-slate-100 bg-slate-50/50">
              <h2 className="text-lg font-bold text-slate-900">Detail Profil</h2>
            </div>
            <form action={updateProfile} className="p-8 space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Email Utama (Read-only)</label>
                <div className="flex items-center gap-3 px-4 py-2.5 bg-slate-50 rounded-xl border border-slate-100 text-slate-500 text-sm">
                  <Shield size={16} />
                  {user?.email}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Nama Lengkap</label>
                <input 
                  name="full_name" 
                  defaultValue={profile?.full_name}
                  placeholder="Masukkan nama lengkap..."
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all" 
                />
              </div>

              <div className="pt-4 flex justify-end">
                <button 
                  type="submit" 
                  className="bg-blue-600 text-white px-8 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:bg-blue-700 transition-all shadow-lg shadow-blue-200"
                >
                  <Save size={18} />
                  Simpan Profil
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
