'use client'

import { useState } from 'react';
import { Trash2, AlertTriangle, Loader2, ShieldAlert, Lock, ArrowRight } from 'lucide-react';
import { deleteAllResidents } from '@/actions/residents';
import { useRouter } from 'next/navigation';

export default function ResetDataButton() {
  const [step, setStep] = useState(0); // 0: Closed, 1: Warning, 2: Verification
  const [confirmText, setConfirmText] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const TARGET_TEXT = 'HAPUS SELURUH DATA PENDUDUK PERMANEN';

  const handleReset = async () => {
    if (confirmText !== TARGET_TEXT) return;
    
    setLoading(true);
    const result = await deleteAllResidents();
    if (result.success) {
      setStep(0);
      setConfirmText('');
      router.refresh();
    } else {
      alert('Gagal menghapus data: ' + result.error);
    }
    setLoading(false);
  };

  const closeAll = () => {
    setStep(0);
    setConfirmText('');
  };

  return (
    <>
      <button
        onClick={() => setStep(1)}
        className="flex items-center justify-center gap-2 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 px-4 py-2 rounded-xl text-sm font-black transition-all border border-red-100 dark:border-red-900/30 shadow-sm"
      >
        <ShieldAlert size={16} />
        RESET DATABASE
      </button>

      {step > 0 && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-xl animate-in fade-in duration-300">
          <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-[3rem] shadow-[0_0_50px_rgba(239,68,68,0.2)] border border-red-200 dark:border-red-900/30 overflow-hidden animate-in zoom-in-95 duration-300">
            
            {/* STEP 1: INITIAL WARNING */}
            {step === 1 && (
              <div className="p-10 space-y-8 text-center">
                <div className="mx-auto w-20 h-20 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center text-red-600 animate-pulse">
                  <AlertTriangle size={40} />
                </div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Tindakan Sangat Berbahaya!</h3>
                  <p className="text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                    Anda akan menghapus seluruh data kependudukan dari database. Ini akan mereset semua angka statistik dan audit log. Tindakan ini <b>TIDAK DAPAT DIBATALKAN</b>.
                  </p>
                </div>
                <div className="flex flex-col gap-3">
                  <button
                    onClick={() => setStep(2)}
                    className="w-full bg-red-600 hover:bg-red-700 text-white font-black py-5 rounded-3xl transition-all shadow-xl shadow-red-500/30 flex items-center justify-center gap-3 text-lg"
                  >
                    SAYA MENGERTI, LANJUTKAN
                    <ArrowRight size={20} />
                  </button>
                  <button
                    onClick={closeAll}
                    className="w-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 font-bold py-4 rounded-2xl hover:bg-slate-200 transition-all text-sm"
                  >
                    BATALKAN
                  </button>
                </div>
              </div>
            )}

            {/* STEP 2: TYPING VERIFICATION (VERCEL STYLE) */}
            {step === 2 && (
              <div className="p-10 space-y-8">
                <div className="flex items-center gap-4 text-red-600 mb-6">
                  <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-2xl">
                    <Lock size={24} />
                  </div>
                  <div>
                    <h3 className="font-black uppercase tracking-widest text-sm">Verifikasi Akhir</h3>
                    <p className="text-xs font-bold text-slate-500">Security Level: MAXIMUM</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <p className="text-sm font-bold text-slate-600 dark:text-slate-400">
                    Ketik kalimat di bawah untuk mengonfirmasi penghapusan permanen:
                  </p>
                  <div className="p-5 bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/20 rounded-2xl">
                    <p className="text-sm font-black text-red-600 dark:text-red-400 italic select-none">
                      &quot;{TARGET_TEXT}&quot;
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  <input
                    type="text"
                    autoFocus
                    value={confirmText}
                    onChange={(e) => setConfirmText(e.target.value)}
                    placeholder="Ketik kalimat konfirmasi..."
                    className="w-full px-6 py-4 rounded-2xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:border-red-500 outline-none transition-all font-bold tracking-tight text-center"
                  />
                </div>

                <div className="flex flex-col gap-3">
                  <button
                    onClick={handleReset}
                    disabled={confirmText !== TARGET_TEXT || loading}
                    className="w-full bg-red-600 hover:bg-red-700 disabled:opacity-30 disabled:grayscale text-white font-black py-5 rounded-3xl transition-all shadow-2xl shadow-red-500/40 flex items-center justify-center gap-3 text-lg"
                  >
                    {loading ? <Loader2 className="animate-spin" /> : <Trash2 size={24} />}
                    HAPUS SEMUA DATA SEKARANG
                  </button>
                  <button
                    onClick={closeAll}
                    className="w-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 font-bold py-4 rounded-2xl hover:bg-slate-200 transition-all text-sm"
                  >
                    BATAL
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}

