'use client';

import { useState } from 'react';
import { Mail, UserPlus, ShieldCheck } from 'lucide-react';
import { inviteAdmin } from '@/actions/auth';
import { toast } from 'sonner';

export const InviteForm = () => {
  const [inviting, setInviting] = useState(false);

  async function handleInvite(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setInviting(true);
    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const toastId = toast.loading(`Mengirim undangan ke ${email}...`);
    try {
      await inviteAdmin(email);
      toast.success(`Undangan berhasil dikirim ke ${email}`, { id: toastId });
      (e.target as HTMLFormElement).reset();
    } catch {
      toast.error('Gagal mengirim undangan. Silakan coba lagi.', { id: toastId });
    } finally {
      setInviting(false);
    }
  }

  return (
    <div className="bg-card rounded-2xl sm:rounded-[3rem] shadow-sm border border-border overflow-hidden lg:sticky lg:top-8">
      <div className="p-5 sm:p-8 border-b border-border bg-muted/30">
        <h2 className="text-lg sm:text-xl font-bold text-foreground tracking-tight uppercase">Undang Admin</h2>
      </div>
      <div className="p-5 sm:p-8 space-y-6 sm:space-y-8">
        <div className="flex items-center gap-3 p-4 bg-primary/5 rounded-2xl border border-primary/10 text-primary">
          <ShieldCheck size={20} className="shrink-0" />
          <p className="text-[10px] font-bold leading-relaxed uppercase tracking-widest">Link aktivasi dikirim via email.</p>
        </div>

        <form onSubmit={handleInvite} className="space-y-4 sm:space-y-6">
          <div className="space-y-2">
            <label className="text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.2em] text-primary/80 ml-1">Email Calon Admin</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
              <input 
                name="email" 
                type="email"
                placeholder="admin@desa.go.id"
                required
                className="w-full h-12 pl-10 pr-4 rounded-full border border-border bg-background text-foreground focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all font-bold tracking-tight text-sm" 
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={inviting}
            className="w-full bg-primary text-primary-foreground h-12 rounded-full font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-all shadow-lg shadow-primary/30 uppercase text-[10px] tracking-widest active:scale-95 disabled:opacity-50"
          >
            {inviting ? 'Mengirim...' : <><UserPlus size={18} /> Kirim Undangan</>}
          </button>
        </form>
      </div>
    </div>
  );
};
