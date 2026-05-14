'use client';

import { useActionState } from 'react';
import { login } from '@/actions/auth';
import { Loader2 } from 'lucide-react';

export default function LoginForm({ error: initialError }: { error?: string | undefined }) {
  const [state, action, isPending] = useActionState(login, null);

  return (
    <form action={action} className="mt-8 space-y-6">
      <div className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-semibold text-secondary-foreground/80 mb-2 ml-1">
            Alamat Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            className="w-full px-5 py-3.5 rounded-2xl bg-black/20 border border-white/10 text-secondary-foreground placeholder:text-secondary-foreground/30 focus:ring-2 focus:ring-primary focus:bg-black/40 outline-none transition-all duration-300"
            placeholder="admin@desa.id"
          />
        </div>
        <div>
          <label htmlFor="password" className="block text-sm font-semibold text-secondary-foreground/80 mb-2 ml-1">
            Kata Sandi
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            className="w-full px-5 py-3.5 rounded-2xl bg-black/20 border border-white/10 text-secondary-foreground placeholder:text-secondary-foreground/30 focus:ring-2 focus:ring-primary focus:bg-black/40 outline-none transition-all duration-300"
            placeholder="••••••••"
          />
        </div>
      </div>

      {(initialError || state?.error) && (
        <div className="bg-destructive/10 border border-destructive/20 p-4 rounded-2xl text-destructive-foreground text-sm font-medium backdrop-blur-md">
          {initialError === 'Invalid credentials' || state?.error === 'Invalid credentials' 
            ? 'Email atau kata sandi salah.' 
            : (initialError || state?.error)}
        </div>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="w-full flex justify-center items-center py-4 px-4 rounded-2xl bg-primary hover:bg-primary/90 text-primary-foreground font-bold shadow-lg shadow-primary/20 transition-all active:scale-[0.97] disabled:opacity-50 disabled:pointer-events-none"
      >
        {isPending ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Memproses...
          </>
        ) : (
          'Masuk Ke Dashboard'
        )}
      </button>
    </form>
  );
}
