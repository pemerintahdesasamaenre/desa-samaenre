'use client';

import { useState } from 'react';
import { User, Briefcase, Phone, MapPin, Save, Mail, Shield } from 'lucide-react';
import { updateProfile } from '@/actions/users';
import { toast } from 'sonner';
import { Profile } from '@/types';
import { useRouter } from 'next/navigation';
import ImageUpload from '@/components/ui/ImageUpload';

interface ProfileFormProps {
  user: Profile;
}

export const ProfileForm = ({ user }: ProfileFormProps) => {
  const [loading, setLoading] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState(user.avatar_url || '');
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());
    
    const toastId = toast.loading('Memperbarui profil...');
    
    try {
      const result = await updateProfile(user.id, data as Record<string, string | number | boolean | null>);

      if (result.error) {
        toast.error(result.error, { id: toastId });
      } else {
        toast.success('Profil berhasil diperbarui', { id: toastId });
        router.refresh();
      }
    } catch {
      toast.error('Terjadi kesalahan. Silakan coba lagi.', { id: toastId });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-card rounded-3xl border border-border shadow-sm overflow-hidden">
      <div className="p-6 border-b border-border bg-muted/20">
        <h2 className="text-lg font-bold">Informasi Pribadi</h2>
        <p className="text-sm text-muted-foreground">Perbarui informasi profil Anda yang akan ditampilkan di sistem.</p>
      </div>
      
      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        <div className="flex justify-center mb-6">
          <div className="w-full max-w-[200px]">
            <ImageUpload 
              value={avatarUrl} 
              onChange={setAvatarUrl} 
              folder="avatars" 
              label="Foto Profil" 
            />
            <input type="hidden" name="avatar_url" value={avatarUrl} />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary/80 ml-1">Email (Akun)</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
              <input 
                value={user.email || ''}
                disabled
                className="w-full h-12 pl-10 pr-4 rounded-2xl border border-border bg-muted/50 text-muted-foreground cursor-not-allowed font-bold tracking-tight text-sm" 
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary/80 ml-1">Wewenang / Role</label>
            <div className="relative">
              <Shield className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
              <input 
                value={user.role === 'admin' ? 'Administrator (Full)' : 'Editor (Konten)'}
                disabled
                className="w-full h-12 pl-10 pr-4 rounded-2xl border border-border bg-muted/50 text-muted-foreground cursor-not-allowed font-bold tracking-tight text-sm uppercase" 
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary/80 ml-1">Nama Lengkap</label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
              <input 
                name="full_name" 
                defaultValue={user.full_name || ''}
                placeholder="Nama Lengkap"
                required
                className="w-full h-12 pl-10 pr-4 rounded-2xl border border-border bg-background text-foreground focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all font-bold tracking-tight text-sm" 
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary/80 ml-1">NIP (Opsional)</label>
            <div className="relative">
              <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
              <input 
                name="nip" 
                defaultValue={user.nip || ''}
                placeholder="1987..."
                className="w-full h-12 pl-10 pr-4 rounded-2xl border border-border bg-background text-foreground focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all font-bold tracking-tight text-sm" 
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary/80 ml-1">Jabatan</label>
            <div className="relative">
              <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
              <input 
                name="position" 
                defaultValue={user.position || ''}
                placeholder="Sekretaris Desa"
                required
                className="w-full h-12 pl-10 pr-4 rounded-2xl border border-border bg-background text-foreground focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all font-bold tracking-tight text-sm" 
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary/80 ml-1">No. HP</label>
            <div className="relative">
              <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
              <input 
                name="phone" 
                defaultValue={user.phone || ''}
                placeholder="0812..."
                required
                className="w-full h-12 pl-10 pr-4 rounded-2xl border border-border bg-background text-foreground focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all font-bold tracking-tight text-sm" 
              />
            </div>
          </div>

          <div className="space-y-2 md:col-span-2">
            <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary/80 ml-1">Alamat</label>
            <div className="relative">
              <MapPin className="absolute left-4 top-4 text-muted-foreground" size={16} />
              <textarea 
                name="address" 
                defaultValue={user.address || ''}
                placeholder="Jl. Merdeka No. 123..."
                rows={3}
                className="w-full pl-10 pr-4 py-3 rounded-2xl border border-border bg-background text-foreground focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all font-bold tracking-tight text-sm min-h-[100px]" 
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <button 
            type="submit" 
            disabled={loading}
            className="w-full md:w-auto px-8 bg-primary text-primary-foreground h-12 rounded-2xl font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-all shadow-lg shadow-primary/30 uppercase text-[10px] tracking-widest active:scale-95 disabled:opacity-50"
          >
            {loading ? 'Menyimpan...' : <><Save size={18} /> Simpan Perubahan</>}
          </button>
        </div>
      </form>
    </div>
  );
};
