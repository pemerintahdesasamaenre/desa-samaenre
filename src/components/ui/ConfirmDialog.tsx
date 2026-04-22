'use client';

import { useState, useEffect } from 'react';
import { AlertTriangle, X, Loader2, ShieldAlert } from 'lucide-react';

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'danger' | 'warning' | 'primary';
  loading?: boolean;
  requirePhrase?: string; // Jika diisi, user wajib mengetik kalimat ini
}

export default function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel = "Konfirmasi",
  cancelLabel = "Batal",
  variant = 'primary',
  loading = false,
  requirePhrase
}: ConfirmDialogProps) {
  const [inputText, setConfirmText] = useState('');

  // Reset input saat dibuka/tutup
  useEffect(() => {
    if (!isOpen) setConfirmText('');
  }, [isOpen]);

  if (!isOpen) return null;

  const isConfirmed = requirePhrase ? inputText === requirePhrase : true;

  const variantStyles = {
    danger: 'bg-red-600 hover:bg-red-700 shadow-red-500/20 text-white',
    warning: 'bg-amber-500 hover:bg-amber-600 shadow-amber-500/20 text-white',
    primary: 'bg-blue-600 hover:bg-blue-700 shadow-blue-500/20 text-white',
  };

  const iconStyles = {
    danger: 'bg-red-100 dark:bg-red-900/30 text-red-600',
    warning: 'bg-amber-100 dark:bg-amber-900/30 text-amber-600',
    primary: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600',
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-[2.5rem] shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className={`p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center ${variant === 'danger' ? 'bg-red-50/50 dark:bg-red-900/10' : 'bg-slate-50/50 dark:bg-slate-800/50'}`}>
          <div className="flex items-center gap-4">
            <div className={`p-2.5 rounded-xl ${iconStyles[variant]}`}>
              {variant === 'danger' ? <ShieldAlert size={24} /> : <AlertTriangle size={24} />}
            </div>
            <h3 className="text-lg font-black tracking-tight text-slate-900 dark:text-white uppercase">{title}</h3>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-8 space-y-6">
          <p className="text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
            {description}
          </p>

          {requirePhrase && (
            <div className="space-y-4">
              <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800">
                <p className="text-xs font-bold text-slate-500 mb-2 uppercase tracking-tighter text-center">Ketik kalimat di bawah untuk verifikasi:</p>
                <p className="text-sm font-black text-slate-900 dark:text-white select-none text-center italic">
                  &quot;{requirePhrase}&quot;
                </p>
              </div>
              <input
                type="text"
                autoFocus
                value={inputText}
                onChange={(e) => setConfirmText(e.target.value)}
                placeholder="Ketik di sini..."
                className="w-full px-6 py-3.5 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:border-blue-500 outline-none transition-all font-bold tracking-tight text-center"
              />
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-col gap-3 pt-2">
            <button
              onClick={onConfirm}
              disabled={!isConfirmed || loading}
              className={`w-full font-black py-4 rounded-2xl transition-all shadow-xl flex items-center justify-center gap-3 ${variantStyles[variant]} disabled:opacity-30 disabled:grayscale`}
            >
              {loading ? <Loader2 className="animate-spin" size={20} /> : null}
              {confirmLabel.toUpperCase()}
            </button>
            <button
              onClick={onClose}
              disabled={loading}
              className="w-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 font-bold py-3.5 rounded-2xl hover:bg-slate-200 transition-all text-sm"
            >
              {cancelLabel.toUpperCase()}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
