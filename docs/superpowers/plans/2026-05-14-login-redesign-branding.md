# Login Redesign & Branding Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Redesign the login page with a Glassmorphism aesthetic and refine global metadata to reflect "Desa Samaenre" branding.

**Architecture:**
- **Metadata**: Centralized update in `src/app/layout.tsx`.
- **UI Component**: New `LoginForm` client component in `src/components/modules/auth/` to handle state and actions.
- **Login Page**: Server component in `src/app/login/page.tsx` for data fetching and layout structure.

**Tech Stack:** Next.js (App Router), React 19 (`useActionState`), Tailwind CSS, Supabase Auth.

---

### Task 1: Global Metadata Refinement

**Files:**
- Modify: `src/app/layout.tsx`

- [ ] **Step 1: Update metadata in `src/app/layout.tsx`**

Replace generic "Desa Digital" strings with "Desa Samaenre" and professionalize descriptions.

```tsx
export const metadata: Metadata = {
  metadataBase: new URL(appUrl),
  title: {
    default: "Website Resmi Desa Samaenre",
    template: "%s | Desa Samaenre"
  },
  description: "Portal informasi publik, statistik penduduk, transparansi anggaran, dan pelayanan desa digital yang mandiri dan inovatif di Desa Samaenre.",
  keywords: ["Desa Samaenre", "Profil Desa", "Pelayanan Publik", "Transparansi Anggaran", "Statistik Desa"],
  authors: [{ name: "Pemerintah Desa Samaenre" }],
  creator: "Pemerintah Desa Samaenre",
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/icon.png', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-icon.png' },
    ],
  },
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: appUrl,
    title: "Website Resmi Desa Samaenre",
    description: "Portal informasi publik, statistik, dan pelayanan digital Desa Samaenre.",
    siteName: "Desa Samaenre",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Profil Desa Samaenre",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Website Resmi Desa Samaenre",
    description: "Portal informasi dan pelayanan digital Desa Samaenre.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};
```

- [ ] **Step 2: Verify metadata via terminal**

Run: `grep "Desa Samaenre" src/app/layout.tsx`
Expected: Multiple matches for title, description, and creator.

- [ ] **Step 3: Commit metadata changes**

```bash
git add src/app/layout.tsx
git commit -m "chore: update global metadata for Desa Samaenre"
```

---

### Task 2: Create LoginForm Client Component

**Files:**
- Create: `src/components/modules/auth/LoginForm.tsx`

- [ ] **Step 1: Implement `LoginForm` with `useActionState`**

Create a client component that manages the login form, handles errors from search params, and shows a loading state.

```tsx
'use client';

import { useActionState } from 'react';
import { login } from '@/actions/auth';
import { Loader2 } from 'lucide-react';

export default function LoginForm({ error }: { error?: string }) {
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

      {(error || state?.error) && (
        <div className="bg-red-500/20 border border-red-500/50 p-4 rounded-xl text-red-200 text-sm">
          {error === 'Invalid credentials' ? 'Email atau kata sandi salah.' : (error || state?.error)}
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
```

- [ ] **Step 2: Update `src/actions/auth.ts` to support `useActionState`**

Ensure the `login` action returns a state object and handles the two-parameter signature required by `useActionState`.

```tsx
'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function login(prevState: any, formData: FormData) {
  const supabase = await createClient()
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  const { error } = await supabase.auth.signInWithPassword({ email, password })

  if (error) {
    return { error: 'Invalid credentials' };
  }

  revalidatePath('/', 'layout')
  redirect('/admin')
}

export async function logout() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  revalidatePath('/', 'layout')
  redirect('/login')
}
```

- [ ] **Step 3: Commit Auth Component**

```bash
git add src/components/modules/auth/LoginForm.tsx src/actions/auth.ts
git commit -m "feat: add LoginForm component with loading state"
```

---

### Task 3: Refactor Login Page for Glassmorphism UI

**Files:**
- Modify: `src/app/login/page.tsx`

- [ ] **Step 1: Fetch village info and render layout**

Update `src/app/login/page.tsx` to fetch `getVillageInfo()` and implement the blurred background.

```tsx
import { getVillageInfo } from '@/services/data-service';
import LoginForm from '@/components/modules/auth/LoginForm';
import Link from 'next/link';
import Image from 'next/image';

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  const villageInfo = await getVillageInfo();

  return (
    <div className="relative min-h-screen flex items-center justify-center p-4 overflow-hidden">
      {/* Background Image with Blur */}
      <div 
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `url(${villageInfo?.header_banner_url || '/placeholder-bg.jpg'})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'blur(20px) brightness(0.5)',
          transform: 'scale(1.1)'
        }}
      />
      
      {/* Login Card */}
      <div className="relative z-10 w-full max-w-md">
        <div className="backdrop-blur-2xl bg-white/10 border border-white/20 p-8 rounded-[2.5rem] shadow-2xl">
          <div className="flex flex-col items-center mb-8">
            {villageInfo?.logo_url && (
              <Image 
                src={villageInfo.logo_url} 
                alt="Logo Desa" 
                width={80} 
                height={80} 
                className="mb-4 drop-shadow-md"
              />
            )}
            <h1 className="text-2xl font-bold text-white text-center">
              {villageInfo?.name || 'Desa Samaenre'}
            </h1>
            <p className="text-white/60 text-sm mt-1">Portal Administrasi Desa</p>
          </div>

          <LoginForm error={error} />

          <div className="mt-8 text-center">
            <Link 
              href="/" 
              className="text-white/40 hover:text-white text-sm transition-colors inline-flex items-center gap-2"
            >
              &larr; Kembali ke Beranda
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Verify Login Page Layout**

Ensure the page renders without errors and the background image is correctly applied.

- [ ] **Step 3: Commit Login Page Refactor**

```bash
git add src/app/login/page.tsx
git commit -m "feat: redesign login page with glassmorphism UI"
```

---

### Task 4: Final Verification & Accessibility

- [ ] **Step 1: Test Login Flow**
  - Enter wrong credentials -> Verify error message.
  - Enter correct credentials -> Verify redirect to `/admin`.
  - Check loading spinner visibility.

- [ ] **Step 2: Check Mobile Responsiveness**
  - Verify card padding and sizing on mobile screen widths.

- [ ] **Step 3: Final Lint and Type Check**

Run: `npm run lint && npm run type-check`
Expected: Clean output.
