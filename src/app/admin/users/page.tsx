import { inviteAdmin } from '@/actions/auth';
import { getProfiles } from '@/services/data-service';
import { UserPlus, Mail, ShieldCheck, User as UserIcon } from 'lucide-react';
import { Profile } from '@/types';

export default async function AdminUsersPage() {
  const profiles = await getProfiles() as Profile[];

  async function handleInvite(formData: FormData) {
    'use server'
    const email = formData.get('email') as string;
    await inviteAdmin(email);
  }

  return (
    <div className="space-y-10 pb-20">
      <div className="bg-card p-8 rounded-[2.5rem] border border-border shadow-sm">
        <h1 className="text-4xl font-black text-foreground tracking-tighter">Manajemen User</h1>
        <p className="text-muted-foreground mt-2 font-medium">Kelola administrator desa dan undang anggota tim pengelola baru.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Form Invite */}
        <div className="lg:col-span-1">
          <div className="bg-card rounded-[3rem] shadow-sm border border-border overflow-hidden sticky top-8">
            <div className="p-8 border-b border-border bg-muted/30">
              <h2 className="text-xl font-black text-foreground tracking-tight uppercase">Undang Admin</h2>
            </div>
            <div className="p-8 space-y-8">
              <div className="flex items-center gap-4 p-5 bg-primary/5 rounded-3xl border border-primary/10 text-primary">
                <ShieldCheck size={24} className="shrink-0" />
                <p className="text-xs font-bold leading-relaxed uppercase tracking-widest">Aktivasi link akan dikirim otomatis melalui email.</p>
              </div>

              <form action={handleInvite} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/80 ml-1">Email Calon Admin</label>
                  <div className="relative">
                    <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                    <input 
                      name="email" 
                      type="email"
                      placeholder="contoh@desa.go.id"
                      required
                      className="w-full h-14 pl-12 pr-6 rounded-full border border-border bg-background text-foreground focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all font-bold tracking-tight" 
                    />
                  </div>
                </div>

                <button 
                  type="submit" 
                  className="w-full bg-primary text-primary-foreground h-14 rounded-full font-black flex items-center justify-center gap-3 hover:opacity-90 transition-all shadow-xl shadow-primary/30 uppercase text-xs tracking-[0.2em] active:scale-95"
                >
                  <UserPlus size={20} />
                  Kirim Undangan
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Tabel User */}
        <div className="lg:col-span-2">
          <div className="bg-card rounded-[3rem] shadow-sm border border-border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-muted/30 border-b border-border">
                    <th className="px-10 py-6 text-[10px] font-black text-primary/80 uppercase tracking-[0.2em]">Administrator</th>
                    <th className="px-10 py-6 text-[10px] font-black text-primary/80 uppercase tracking-[0.2em]">Role</th>
                    <th className="px-10 py-6 text-[10px] font-black text-primary/80 uppercase tracking-[0.2em]">Terakhir Update</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {profiles.map((profile: Profile) => (
                    <tr key={profile.id} className="hover:bg-primary/5 transition-colors">
                      <td className="px-10 py-6">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-2xl bg-muted flex items-center justify-center text-primary">
                            <UserIcon size={24} />
                          </div>
                          <div>
                            <div className="font-black text-foreground tracking-tight text-lg leading-none">{profile.full_name || 'Admin Desa'}</div>
                            <div className="text-[10px] text-muted-foreground font-mono font-bold mt-2 uppercase tracking-widest opacity-60">ID: {profile.id.substring(0, 8)}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-10 py-6">
                        <span className="px-3 py-1 bg-primary/10 text-primary border border-primary/20 rounded-full text-[10px] font-black uppercase tracking-widest">
                          {profile.role}
                        </span>
                      </td>
                      <td className="px-10 py-6 text-sm font-bold text-muted-foreground">
                        {new Date(profile.updated_at).toLocaleDateString('id-ID', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric'
                        })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
