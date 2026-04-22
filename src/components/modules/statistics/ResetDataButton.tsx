'use client'

import { useState } from 'react';
import { Trash2, AlertTriangle, X, Loader2 } from 'lucide-react';
import { deleteAllResidents } from '@/actions/residents';
import { useRouter } from 'next/navigation';

export default function ResetDataButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [confirmText, setConfirmText] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const TARGET_TEXT = 'HAPUS SEMUA DATA';

  const handleReset = async () => {
    if (confirmText !== TARGET_TEXT) return;
    
    setLoading(true);
    const result = await deleteAllResidents();
    if (result.success) {
      setIsOpen(false);
      setConfirmText('');
      router.refresh();
    } else {
      alert('Gagal menghapus data: ' + result.error);
    }
    setLoading(false);
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center justify-center gap-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 px-4 py-2 rounded-lg text-sm font-bold transition-colors"
      >
        <Trash2 size={16} />
        Reset Data
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-red-50 dark:bg-red-900/10">
              <div className="flex items-center gap-3 text-red-600">
                <AlertTriangle size={24} />
                <h3 className="text-lg font-bold">Tindakan Sangat Berbahaya!</h3>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X size={20} />
              </button>
            </div>

            <div className="p-8 space-y-6">
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                Anda akan menghapus <b>SELURUH</b> data penduduk dari database. Tindakan ini tidak dapat dibatalkan.
              </p>

              <div className="space-y-3">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Ketik <span className="text-red-600 font-black">&quot;{TARGET_TEXT}&quot;</span> untuk konfirmasi:
                </label>
                <input
                  type="text"
                  value={confirmText}
                  onChange={(e) => setConfirmText(e.target.value.toUpperCase())}
                  placeholder="Ketik kalimat konfirmasi..."
                  className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:border-red-500 outline-none transition-all font-bold tracking-tight"
                />
              </div>

              <div className="flex flex-col gap-3">
                <button
                  onClick={handleReset}
                  disabled={confirmText !== TARGET_TEXT || loading}
                  className="w-full bg-red-600 hover:bg-red-700 disabled:opacity-30 text-white font-bold py-4 rounded-2xl transition-all shadow-xl shadow-red-500/20 flex items-center justify-center gap-2"
                >
                  {loading ? <Loader2 className="animate-spin" /> : <Trash2 size={20} />}
                  SAYA SADAR DAN INGIN HAPUS SEMUANYA
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="w-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold py-3 rounded-2xl hover:bg-slate-200 transition-all"
                >
                  Batal
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
