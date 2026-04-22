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
    <div className="space-y-10 max-w-4xl pb-20">
      <div className="bg-card p-8 rounded-[2.5rem] border border-border shadow-sm">
        <h1 className="text-4xl font-black text-foreground tracking-tighter">Pengaturan</h1>
        <p className="text-muted-foreground mt-2 font-medium">Kelola akun admin dan konfigurasi personal Anda.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
        <div className="md:col-span-1 space-y-6">
          <div className="p-6 bg-card rounded-[2rem] border border-primary/20 shadow-xl shadow-primary/5 flex items-center gap-5">
            <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
              <User size={28} />
            </div>
            <div>
              <div className="font-black text-foreground tracking-tight">Profil Saya</div>
              <div className="text-[10px] text-primary font-bold uppercase tracking-widest mt-1">Data Personal</div>
            </div>
          </div>
          <div className="p-6 bg-muted/30 rounded-[2rem] border border-border flex items-center gap-5 opacity-50 grayscale cursor-not-allowed">
            <div className="w-14 h-14 rounded-2xl bg-background flex items-center justify-center text-muted-foreground">
              <Key size={28} />
            </div>
            <div>
              <div className="font-bold text-muted-foreground">Keamanan</div>
              <div className="text-[10px] font-bold uppercase tracking-widest mt-1 text-muted-foreground/60">Ganti Password</div>
            </div>
          </div>
        </div>

        <div className="md:col-span-2">
          <div className="bg-card rounded-[3rem] shadow-sm border border-border overflow-hidden">
            <div className="p-8 border-b border-border bg-muted/30">
              <h2 className="text-xl font-black text-foreground tracking-tight uppercase">Detail Profil</h2>
            </div>
            <form action={updateProfile} className="p-8 space-y-8">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/80 ml-1">Email Utama (Read-only)</label>
                <div className="flex items-center gap-3 h-14 px-6 bg-muted/50 rounded-full border border-border text-muted-foreground font-mono font-bold text-sm">
                  <Shield size={18} className="text-primary/60" />
                  {user?.email}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/80 ml-1">Nama Lengkap</label>
                <input 
                  name="full_name" 
                  defaultValue={profile?.full_name}
                  placeholder="Masukkan nama lengkap..."
                  className="w-full h-14 px-6 rounded-full border border-border bg-background text-foreground focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all font-bold tracking-tight" 
                />
              </div>

              <div className="pt-6 border-t border-border flex justify-end">
                <button 
                  type="submit" 
                  className="bg-primary text-primary-foreground px-10 h-14 rounded-full font-black flex items-center justify-center gap-3 hover:opacity-90 transition-all shadow-xl shadow-primary/30 uppercase text-xs tracking-widest active:scale-95"
                >
                  <Save size={20} />
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
