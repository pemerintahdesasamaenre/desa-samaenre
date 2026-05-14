'use client';

import { useState } from 'react';
import { Mail, Lock, User, Briefcase, Phone, Shield, Save, X, MapPin } from 'lucide-react';
import { createUser, updateProfile } from '@/actions/users';
import { toast } from 'sonner';
import { Profile } from '@/types';
import { useRouter } from 'next/navigation';
import ImageUpload from '@/components/ui/ImageUpload';

interface UserFormProps {
  user?: Profile | undefined;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export const UserForm = ({ user, onSuccess, onCancel }: UserFormProps) => {
  const [loading, setLoading] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState(user?.avatar_url || '');
  const router = useRouter();
  const isEditing = !!user;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());
    
    const toastId = toast.loading(isEditing ? 'Memperbarui profil...' : 'Membuat akun baru...');
    
    try {
      let result;
      if (isEditing) {
        // Update profile doesn't include email/password
        const { email, password, ...profileData } = data;
        result = await updateProfile(user.id, profileData);
      } else {
        result = await createUser(data);
      }

      if (result.error) {
        toast.error(result.error, { id: toastId });
      } else {
        toast.success(isEditing ? 'Profil berhasil diperbarui' : 'Akun berhasil dibuat', { id: toastId });
        router.refresh();
        if (!isEditing) (e.target as HTMLFormElement).reset();
        onSuccess?.();
      }
    } catch {
      toast.error('Terjadi kesalahan. Silakan coba lagi.', { id: toastId });
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
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

      {isEditing && (
        <div className="space-y-2">
          <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary/80 ml-1">Email</label>
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
            <input 
              value={user.email || ''}
              disabled
              className="w-full h-12 pl-10 pr-4 rounded-2xl border border-border bg-muted/50 text-muted-foreground cursor-not-allowed font-bold tracking-tight text-sm" 
            />
          </div>
        </div>
      )}

      {!isEditing && (
        <>
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary/80 ml-1">Email</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
              <input 
                name="email" 
                type="email"
                placeholder="admin@desa.go.id"
                required
                className="w-full h-12 pl-10 pr-4 rounded-2xl border border-border bg-background text-foreground focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all font-bold tracking-tight text-sm" 
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary/80 ml-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
              <input 
                name="password" 
                type="password"
                placeholder="••••••••"
                required
                minLength={6}
                className="w-full h-12 pl-10 pr-4 rounded-2xl border border-border bg-background text-foreground focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all font-bold tracking-tight text-sm" 
              />
            </div>
          </div>
        </>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary/80 ml-1">Nama Lengkap</label>
          <div className="relative">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
            <input 
              name="full_name" 
              defaultValue={user?.full_name || ''}
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
              defaultValue={user?.nip || ''}
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
              defaultValue={user?.position || ''}
              placeholder="Sekretaris Desa"
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
              defaultValue={user?.phone || ''}
              placeholder="0812..."
              className="w-full h-12 pl-10 pr-4 rounded-2xl border border-border bg-background text-foreground focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all font-bold tracking-tight text-sm" 
            />
          </div>
        </div>

        <div className="space-y-2 sm:col-span-2">
          <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary/80 ml-1">Alamat</label>
          <div className="relative">
            <MapPin className="absolute left-4 top-4 text-muted-foreground" size={16} />
            <textarea 
              name="address" 
              defaultValue={user?.address || ''}
              placeholder="Jl. Merdeka No. 1..."
              className="w-full pl-10 pr-4 py-3 rounded-2xl border border-border bg-background text-foreground focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all font-bold tracking-tight text-sm min-h-[80px]" 
            />
          </div>
        </div>

        <div className="space-y-2 sm:col-span-2">
          <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary/80 ml-1">Role / Wewenang</label>
          <div className="relative">
            <Shield className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
            <select 
              name="role"
              defaultValue={user?.role || 'editor'}
              className="w-full h-12 pl-10 pr-4 rounded-2xl border border-border bg-background text-foreground focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all font-bold tracking-tight text-sm appearance-none"
            >
              <option value="admin">Administrator (Full Access)</option>
              <option value="editor">Editor (Konten Saja)</option>
            </select>
          </div>
        </div>
      </div>

      <div className="flex gap-3 pt-2">
        {onCancel && (
          <button 
            type="button"
            onClick={onCancel}
            className="flex-1 bg-muted text-muted-foreground h-12 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-muted/80 transition-all uppercase text-[10px] tracking-widest"
          >
            <X size={18} /> Batal
          </button>
        )}
        <button 
          type="submit" 
          disabled={loading}
          className="flex-[2] bg-primary text-primary-foreground h-12 rounded-2xl font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-all shadow-lg shadow-primary/30 uppercase text-[10px] tracking-widest active:scale-95 disabled:opacity-50"
        >
          {loading ? 'Menyimpan...' : <><Save size={18} /> {isEditing ? 'Simpan Perubahan' : 'Buat Akun'}</>}
        </button>
      </div>
    </form>
  );
};
