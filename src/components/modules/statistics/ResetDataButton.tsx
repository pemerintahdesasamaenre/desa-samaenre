'use client'

import { useState } from 'react';
import { ShieldAlert } from 'lucide-react';
import { deleteAllResidents } from '@/actions/residents';
import { useRouter } from 'next/navigation';
import ConfirmDialog from '@/components/ui/ConfirmDialog';

export default function ResetDataButton() {
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const TARGET_PHRASE = 'HAPUS SELURUH DATA PENDUDUK PERMANEN';

  const handleReset = async () => {
    setLoading(true);
    try {
      const result = await deleteAllResidents();
      if (result.success) {
        setShowConfirm(false);
        router.refresh();
      } else {
        alert('Gagal menghapus data: ' + result.error);
      }
    } catch {
      alert('Terjadi kesalahan sistem saat mereset data.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setShowConfirm(true)}
        className="flex items-center justify-center gap-2 text-destructive hover:bg-destructive/10 px-6 py-3 rounded-full text-[10px] font-black uppercase tracking-widest transition-all border border-destructive/20 shadow-sm active:scale-95"
      >
        <ShieldAlert size={16} />
        Reset Database
      </button>

      <ConfirmDialog 
        isOpen={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={handleReset}
        title="Tindakan Sangat Berbahaya!"
        description="Anda akan menghapus seluruh data kependudukan dari database. Ini akan mereset semua angka statistik dan audit log. Tindakan ini TIDAK DAPAT DIBATALKAN."
        variant="danger"
        confirmLabel="Hapus Semua Data Sekarang"
        requirePhrase={TARGET_PHRASE}
        loading={loading}
      />
    </>
  );
}
