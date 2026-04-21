'use client';

import { Trash2 } from 'lucide-react';
import { deleteDemographic } from '@/actions/demographics';
import { useState } from 'react';

interface DeleteButtonProps {
  id: string;
  label: string;
}

export function DeleteButton({ id, label }: DeleteButtonProps) {
  const [isPending, setIsPending] = useState(false);

  const handleDelete = async () => {
    if (confirm(`Apakah Anda yakin ingin menghapus data "${label}"?`)) {
      setIsPending(true);
      try {
        const result = await deleteDemographic(id);
        if (result?.error) {
          alert(`Gagal menghapus: ${result.error}`);
        }
      } catch {
        alert('Terjadi kesalahan saat menghapus data.');
      } finally {
        setIsPending(false);
      }
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={isPending}
      className={`p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors ${
        isPending ? 'opacity-50 cursor-not-allowed' : ''
      }`}
      title="Hapus Data"
    >
      <Trash2 size={18} />
    </button>
  );
}
