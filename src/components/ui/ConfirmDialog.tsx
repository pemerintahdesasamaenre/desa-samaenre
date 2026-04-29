'use client';

import { useState } from 'react';
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
  requirePhrase?: string | undefined;
  requirePhrase2?: string | undefined;
  phraseLabel?: string;
  phraseLabel2?: string;
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
  requirePhrase,
  requirePhrase2,
  phraseLabel = "Ketik kalimat di bawah untuk verifikasi:",
  phraseLabel2 = "Ketik kalimat kedua untuk konfirmasi akhir:"
}: ConfirmDialogProps) {
  const [inputText, setConfirmText] = useState('');
  const [inputText2, setConfirmText2] = useState('');

  const handleClose = () => {
    setConfirmText('');
    setConfirmText2('');
    onClose();
  };

  const handleConfirm = () => {
    onConfirm();
    // Reset state after confirm if needed, but usually modal closes
  };

  if (!isOpen) return null;

  const isConfirmed = 
    (!requirePhrase || inputText === requirePhrase) && 
    (!requirePhrase2 || inputText2 === requirePhrase2);

  const variantStyles = {
    danger: 'bg-red-600 hover:bg-red-700 shadow-red-500/20 text-white',
    warning: 'bg-amber-500 hover:bg-amber-600 shadow-amber-500/20 text-white',
    primary: 'bg-primary hover:opacity-90 shadow-primary/20 text-primary-foreground',
  };

  const iconStyles = {
    danger: 'bg-red-100 dark:bg-red-900/30 text-red-600',
    warning: 'bg-amber-100 dark:bg-amber-900/30 text-amber-600',
    primary: 'bg-primary/10 text-primary',
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-background/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-card w-full max-w-lg rounded-[2.5rem] shadow-2xl border border-border overflow-hidden animate-in zoom-in-95 duration-200">
        
        <div className={`p-6 border-b border-border flex justify-between items-center ${variant === 'danger' ? 'bg-red-500/10' : 'bg-muted/50'}`}>
          <div className="flex items-center gap-4">
            <div className={`p-2.5 rounded-xl ${iconStyles[variant]}`}>
              {variant === 'danger' ? <ShieldAlert size={24} /> : <AlertTriangle size={24} />}
            </div>
            <h3 className="text-lg font-bold tracking-tight text-foreground uppercase">{title}</h3>
          </div>
          <button onClick={handleClose} className="p-2 text-muted-foreground hover:text-foreground transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="p-8 space-y-6">
          <p className="text-muted-foreground leading-relaxed font-medium">
            {description}
          </p>

          <div className="space-y-4">
            {requirePhrase && (
              <div className="space-y-2">
                <div className="p-4 bg-muted/50 rounded-2xl border border-border">
                  <p className="text-[10px] font-bold text-primary/80 mb-1 uppercase tracking-[0.2em] text-center">{phraseLabel}</p>
                  <p className="text-sm font-bold text-foreground select-none text-center italic">
                    &quot;{requirePhrase}&quot;
                  </p>
                </div>
                <input
                  type="text"
                  autoFocus={!requirePhrase2}
                  value={inputText}
                  onChange={(e) => setConfirmText(e.target.value)}
                  placeholder="Ketik di sini..."
                  className="w-full px-6 py-4 rounded-2xl border-2 border-border bg-background text-foreground focus:border-primary outline-none transition-all font-bold tracking-tight text-center"
                />
              </div>
            )}

            {requirePhrase2 && (
              <div className="space-y-2">
                <div className="p-4 bg-muted/50 rounded-2xl border border-border">
                  <p className="text-[10px] font-bold text-primary/80 mb-1 uppercase tracking-[0.2em] text-center">{phraseLabel2}</p>
                  <p className="text-sm font-bold text-foreground select-none text-center italic">
                    &quot;{requirePhrase2}&quot;
                  </p>
                </div>
                <input
                  type="text"
                  value={inputText2}
                  onChange={(e) => setConfirmText2(e.target.value)}
                  placeholder="Ketik di sini..."
                  className="w-full px-6 py-4 rounded-2xl border-2 border-border bg-background text-foreground focus:border-primary outline-none transition-all font-bold tracking-tight text-center"
                />
              </div>
            )}
          </div>

          <div className="flex flex-col gap-3 pt-2">
            <button
              onClick={handleConfirm}
              disabled={!isConfirmed || loading}
              className={`w-full font-bold py-4 rounded-2xl transition-all shadow-xl flex items-center justify-center gap-3 ${variantStyles[variant]} disabled:opacity-30 disabled:grayscale`}
            >
              {loading ? <Loader2 className="animate-spin" size={20} /> : null}
              {confirmLabel.toUpperCase()}
            </button>
            <button
              onClick={handleClose}
              disabled={loading}
              className="w-full bg-muted text-muted-foreground font-bold py-3.5 rounded-2xl hover:bg-muted/80 transition-all text-sm"
            >
              {cancelLabel.toUpperCase()}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
