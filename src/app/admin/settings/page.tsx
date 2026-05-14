import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { ProfileForm } from '@/components/modules/users/ProfileForm';
import { Settings, User } from 'lucide-react';
import { Profile } from '@/types';

export default async function SettingsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  if (!profile) {
    return <div>Profil tidak ditemukan.</div>;
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-card p-8 rounded-[2rem] border border-border shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full -mr-32 -mt-32 blur-3xl" />
        <div className="relative">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Settings className="text-primary" size={20} />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary">Sistem</span>
          </div>
          <h1 className="text-4xl font-black tracking-tight text-foreground">
            Pengaturan <span className="text-primary">Profil</span>
          </h1>
          <p className="text-muted-foreground mt-2 font-medium max-w-md">
            Kelola informasi akun dan pengaturan personal Anda di sini.
          </p>
        </div>

        <div className="flex items-center gap-4 bg-muted/30 p-4 rounded-2xl border border-border">
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
            <User size={24} />
          </div>
          <div>
            <div className="text-sm font-bold text-foreground">{profile.full_name}</div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">{profile.role}</div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl">
        <ProfileForm user={profile as Profile} />
      </div>
    </div>
  );
}
