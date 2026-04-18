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
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden sticky top-8">
            <div className="p-6 border-b border-slate-100 bg-slate-50/50">
              <h2 className="text-lg font-bold text-slate-900">Undang Admin Baru</h2>
            </div>
            <div className="p-6 space-y-6">
              <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-xl border border-blue-100 text-blue-800">
                <ShieldCheck size={20} className="shrink-0" />
                <p className="text-xs font-medium">Admin baru akan menerima link aktivasi melalui email.</p>
              </div>

              <form action={handleInvite} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">Email Calon Admin</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-2.5 text-slate-400" size={18} />
                    <input 
                      name="email" 
                      type="email"
                      placeholder="contoh@desa.go.id"
                      required
                      className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm" 
                    />
                  </div>
                </div>

                <button 
                  type="submit" 
                  className="w-full bg-blue-600 text-white py-2.5 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-blue-700 transition-all shadow-lg shadow-blue-200"
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
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                    <th className="px-6 py-4 text-sm font-semibold text-slate-700">Administrator</th>
                    <th className="px-6 py-4 text-sm font-semibold text-slate-700">Role</th>
                    <th className="px-6 py-4 text-sm font-semibold text-slate-700">Terakhir Update</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {profiles.map((profile: any) => (
                    <tr key={profile.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                            <UserIcon size={20} />
                          </div>
                          <div>
                            <div className="text-sm font-bold text-slate-900">{profile.full_name || 'Admin Desa'}</div>
                            <div className="text-xs text-slate-500 font-mono">{profile.id.substring(0, 8)}...</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-2.5 py-1 bg-green-50 text-green-700 rounded-lg text-xs font-bold uppercase tracking-wider">
                          {profile.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-500">
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
