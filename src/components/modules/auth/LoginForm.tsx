'use client';

import { useActionState } from 'react';
import { login } from '@/actions/auth';
import { Loader2 } from 'lucide-react';

export default function LoginForm({ error: initialError }: { error?: string }) {
  const [state, action, isPending] = useActionState(login, null);

  return (
    <form action={action} className="mt-8 space-y-6">
      <div className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-white/80 mb-1">
            Alamat Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-white/40 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
            placeholder="admin@desa.id"
          />
        </div>
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-white/80 mb-1">
            Kata Sandi
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-white/40 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
            placeholder="••••••••"
          />
        </div>
      </div>

      {(initialError || state?.error) && (
        <div className="bg-red-500/20 border border-red-500/50 p-4 rounded-xl text-red-200 text-sm">
          {initialError === 'Invalid credentials' || state?.error === 'Invalid credentials' 
            ? 'Email atau kata sandi salah.' 
            : (initialError || state?.error)}
        </div>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="w-full flex justify-center items-center py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold shadow-lg shadow-blue-900/20 transition-all active:scale-95 disabled:opacity-50 disabled:pointer-events-none"
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
