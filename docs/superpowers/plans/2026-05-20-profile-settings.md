# Profile Settings Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Create a profile settings page for users to update their personal information and fix data consistency issues in user management.

**Architecture:** Use a server component for the settings page to fetch the current user's profile and a client component for the form to handle updates via server actions. Fix existing forms to ensure they refresh data after updates.

**Tech Stack:** Next.js (App Router), Supabase (Auth & Database), Lucide React (Icons), Sonner (Toasts).

---

### Task 1: Fix User Management Data Consistency

**Files:**
- Modify: `src/components/modules/users/UserForm.tsx`
- Modify: `src/components/modules/users/UserTable.tsx`
- Modify: `src/components/modules/users/UserManagement.tsx`

- [ ] **Step 1: Add router.refresh() to UserForm.tsx**
Ensure the UI updates after a user is created or updated. Also add the missing `address` field.

```tsx
// ... imports
import { useRouter } from 'next/navigation';
import { MapPin } from 'lucide-react';

// Inside UserForm component:
const router = useRouter();

// Inside handleSubmit, after successful result:
toast.success(isEditing ? 'Profil berhasil diperbarui' : 'Akun berhasil dibuat', { id: toastId });
router.refresh(); // Add this
if (!isEditing) (e.target as HTMLFormElement).reset();
onSuccess?.();
```

- [ ] **Step 2: Add router.refresh() to UserTable.tsx**
Ensure the UI updates after a user is deleted.

```tsx
// ... imports
import { useRouter } from 'next/navigation';

// Inside UserTable component:
const router = useRouter();

// Inside handleDelete, after successful result:
toast.success('User berhasil dihapus', { id: toastId });
router.refresh(); // Add this
```

- [ ] **Step 3: Add key to UserForm in UserManagement.tsx**
Ensure the form is fully reset with new props when switching users.

```tsx
<UserForm 
  key={editingUser?.id || 'new'} 
  user={editingUser} 
  onSuccess={handleClose} 
  onCancel={handleClose} 
/>
```

---

### Task 2: Create ProfileForm Component (Settings)

**Files:**
- Create: `src/components/modules/users/ProfileForm.tsx`

- [ ] **Step 1: Implement ProfileForm**
Create a form component for individual settings. Use `router.refresh()` on success.

```tsx
'use client';

import { useState } from 'react';
import { User, Briefcase, Phone, MapPin, Save } from 'lucide-react';
import { updateProfile } from '@/actions/users';
import { toast } from 'sonner';
import { Profile } from '@/types';
import { useRouter } from 'next/navigation';

interface ProfileFormProps {
  user: Profile;
}

export const ProfileForm = ({ user }: ProfileFormProps) => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());
    
    const toastId = toast.loading('Memperbarui profil...');
    
    try {
      const result = await updateProfile(user.id, data);

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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
```

---

### Task 3: Create Admin Settings Page

**Files:**
- Create: `src/app/admin/settings/page.tsx`

- [ ] **Step 1: Implement settings page**
Fetch the current logged-in user and their profile data.

```tsx
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
```

---

### Task 4: Final Verification and Commit

- [ ] **Step 1: Check build/lint**
- [ ] **Step 2: Commit**

```bash
git add src/components/modules/users/UserForm.tsx src/components/modules/users/UserTable.tsx src/components/modules/users/UserManagement.tsx src/components/modules/users/ProfileForm.tsx src/app/admin/settings/page.tsx docs/superpowers/plans/2026-05-20-profile-settings.md docs/superpowers/specs/2026-05-20-profile-settings-design.md
git commit -m "feat: add profile settings page and fix data consistency in user management"
```
