import { inviteAdmin } from '@/actions/auth';
import { getProfiles } from '@/services/data-service';
import { UserPlus, Mail, ShieldCheck, User as UserIcon } from 'lucide-react';

export default async function AdminUsersPage() {
  const profiles = await getProfiles();

  async function handleInvite(formData: FormData) {
    'use server'
    const email = formData.get('email') as string;
    await inviteAdmin(email);
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Manajemen User</h1>
        <p className="text-slate-500 mt-2">Kelola administrator desa dan undang anggota tim baru.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form Invite */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden sticky top-8">
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">Undang Admin Baru</h2>
            </div>
            <div className="p-6 space-y-6">
              <div className="flex items-center gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-100 dark:border-blue-900/30 text-blue-800 dark:text-blue-400">
                <ShieldCheck size={20} className="shrink-0" />
                <p className="text-xs font-medium">Admin baru akan menerima link aktivasi melalui email.</p>
              </div>

              <form action={handleInvite} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Email Calon Admin</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-2.5 text-slate-400 dark:text-slate-500" size={18} />
                    <input 
                      name="email" 
                      type="email"
                      placeholder="contoh@desa.go.id"
                      required
                      className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm" 
                    />
                  </div>
                </div>

                <button 
                  type="submit" 
                  className="w-full bg-blue-600 text-white py-2.5 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 dark:shadow-blue-900/20"
                >
                  <UserPlus size={18} />
                  Kirim Undangan
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Tabel User */}
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800">
                    <th className="px-6 py-4 text-sm font-semibold text-slate-700 dark:text-slate-300">Administrator</th>
                    <th className="px-6 py-4 text-sm font-semibold text-slate-700 dark:text-slate-300">Role</th>
                    <th className="px-6 py-4 text-sm font-semibold text-slate-700 dark:text-slate-300">Terakhir Update</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {profiles.map((profile: any) => (
                    <tr key={profile.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 dark:text-slate-500">
                            <UserIcon size={20} />
                          </div>
                          <div>
                            <div className="text-sm font-bold text-slate-900 dark:text-white">{profile.full_name || 'Admin Desa'}</div>
                            <div className="text-xs text-slate-500 dark:text-slate-400 font-mono">{profile.id.substring(0, 8)}...</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-2.5 py-1 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 rounded-lg text-xs font-bold uppercase tracking-wider">
                          {profile.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-500 dark:text-slate-400">
                        {new Date(profile.updated_at).toLocaleDateString('id-ID', {
                          day: 'numeric',
                          month: 'short',
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
