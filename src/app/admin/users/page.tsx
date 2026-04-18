import { inviteAdmin } from '@/actions/auth';
import { UserPlus, Mail, ShieldCheck } from 'lucide-react';

export default function AdminUsersPage() {
  async function handleInvite(formData: FormData) {
    'use server'
    const email = formData.get('email') as string;
    await inviteAdmin(email);
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Manajemen User</h1>
        <p className="text-slate-500 mt-2">Undang admin desa baru untuk membantu mengelola konten.</p>
      </div>

      <div className="max-w-2xl bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-8 space-y-6">
          <div className="flex items-center gap-4 p-4 bg-blue-50 rounded-xl border border-blue-100 text-blue-800">
            <ShieldCheck size={24} />
            <p className="text-sm font-medium">Sistem ini menggunakan alur undangan email. Admin baru akan menerima email untuk mengatur password mereka sendiri.</p>
          </div>

          <form action={handleInvite} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Email Calon Admin</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 text-slate-400" size={20} />
                <input 
                  name="email" 
                  type="email"
                  placeholder="contoh: staf@desa.go.id"
                  required
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all" 
                />
              </div>
            </div>

            <button 
              type="submit" 
              className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-blue-700 transition-all shadow-lg shadow-blue-200"
            >
              <UserPlus size={20} />
              Kirim Undangan Admin
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
