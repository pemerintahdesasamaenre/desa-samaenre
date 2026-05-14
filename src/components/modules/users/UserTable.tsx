'use client';

import { useState } from 'react';
import { User as UserIcon, Clock, Shield, Edit2, Trash2, Phone, Briefcase } from 'lucide-react';
import { Profile } from '@/types';
import { DataTable, Column } from '@/components/ui/DataTable';
import { useRouter } from "next/navigation";
import { deleteUser } from '@/actions/users';
import { toast } from 'sonner';
import ConfirmDialog from '@/components/ui/ConfirmDialog';

interface UserTableProps {
  profiles: Profile[];
  onEdit: (profile: Profile) => void;
}

export const UserTable = ({ profiles, onEdit }: UserTableProps) => {
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    if (!deletingId) return;
    
    setLoading(true);
    const toastId = toast.loading('Menghapus user...');
    
    try {
      const result = await deleteUser(deletingId);
      if (result.error) {
        toast.error(result.error, { id: toastId });
      } else {
        toast.success('User berhasil dihapus', { id: toastId });
      }
    } catch {
      toast.error('Gagal menghapus user', { id: toastId });
    } finally {
      setLoading(false);
      setDeletingId(null);
    }
  };

  const columns: Column<Profile>[] = [
    {
      header: 'Administrator',
      accessor: (profile) => (
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
            {profile.avatar_url ? (
              <img src={profile.avatar_url} alt="" className="w-full h-full rounded-xl object-cover" />
            ) : (
              <UserIcon size={18} />
            )}
          </div>
          <div className="min-w-0">
            <div className="font-bold text-foreground tracking-tight text-sm sm:text-base leading-none truncate">{profile.full_name || 'Administrator'}</div>
            <div className="md:hidden text-[10px] font-bold text-primary uppercase mt-1">{profile.role}</div>
          </div>
        </div>
      ),
    },
    {
      header: 'Role',
      hideOnMobile: true,
      accessor: (profile) => (
        <span className="px-2 py-0.5 bg-primary/10 text-primary border border-primary/20 rounded-full text-[10px] font-bold uppercase tracking-widest">
          {profile.role}
        </span>
      ),
    },
    {
      header: 'Jabatan',
      hideOnMobile: true,
      hideOnTablet: true,
      accessor: (profile) => (
        <span className="text-xs font-medium text-muted-foreground italic">
          {profile.position || '-'}
        </span>
      ),
    },
    {
      header: 'Aksi',
      align: 'right',
      accessor: (profile) => (
        <div className="flex items-center justify-end gap-2">
          <button 
            onClick={() => onEdit(profile)}
            className="p-2 bg-muted hover:bg-primary/10 hover:text-primary rounded-xl transition-colors border border-border"
            title="Edit User"
          >
            <Edit2 size={16} />
          </button>
          <button 
            onClick={() => setDeletingId(profile.id)}
            className="p-2 bg-muted hover:bg-red-500/10 hover:text-red-500 rounded-xl transition-colors border border-border"
            title="Hapus User"
          >
            <Trash2 size={16} />
          </button>
        </div>
      ),
    },
  ];

  const renderExpandedRow = (profile: Profile) => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 p-2">
      <div className="space-y-1.5">
        <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-1.5">
          <Shield size={10} className="text-primary" /> Wewenang
        </p>
        <p className="text-xs font-bold text-foreground uppercase">{profile.role}</p>
      </div>

      <div className="space-y-1.5">
        <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-1.5">
          <Briefcase size={10} className="text-primary" /> Jabatan & NIP
        </p>
        <p className="text-xs font-bold text-foreground truncate">{profile.position || '-'}</p>
        {profile.nip && <p className="text-[10px] font-medium text-muted-foreground">NIP. {profile.nip}</p>}
      </div>

      <div className="space-y-1.5">
        <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-1.5">
          <Phone size={10} className="text-primary" /> Kontak
        </p>
        <p className="text-xs font-bold text-foreground">{profile.phone || '-'}</p>
      </div>

      <div className="space-y-1.5">
        <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-1.5">
          <Clock size={10} className="text-primary" /> Terakhir Update
        </p>
        <p className="text-xs font-bold text-foreground">{new Date(profile.updated_at).toLocaleDateString('id-ID', {
          day: 'numeric',
          month: 'long',
          year: 'numeric'
        })}</p>
      </div>
    </div>
  );

  return (
    <>
      <DataTable
        data={profiles}
        columns={columns}
        keyExtractor={(profile) => profile.id}
        renderExpandedRow={renderExpandedRow}
      />

      <ConfirmDialog
        isOpen={!!deletingId}
        onClose={() => setDeletingId(null)}
        onConfirm={handleDelete}
        title="Hapus Administrator"
        description="Apakah Anda yakin ingin menghapus akun ini? Tindakan ini tidak dapat dibatalkan dan user akan kehilangan akses ke dashboard."
        confirmLabel="Hapus Akun"
        variant="danger"
        loading={loading}
      />
    </>
  );
};
