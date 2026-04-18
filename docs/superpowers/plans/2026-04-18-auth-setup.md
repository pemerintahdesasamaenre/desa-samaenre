# Auth & Admin Management Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Membangun sistem autentikasi Admin Desa menggunakan Supabase Auth dengan alur "Admin Invites Admin" dan proteksi rute middleware.

**Architecture:** Menggunakan Server Actions untuk Auth logic dan Middleware untuk penegakan keamanan rute. Service Role Key digunakan hanya di sisi server untuk mengelola user.

**Tech Stack:** Next.js 14, Supabase Auth (@supabase/ssr), TailwindCSS, Zod.

---

### Task 1: Supabase Admin Client Setup

**Files:**
- Create: `src/lib/supabase/admin.ts`

- [ ] **Step 1: Create Admin Client utilizing SERVICE_ROLE_KEY**

```typescript
// src/lib/supabase/admin.ts
import { createClient } from '@supabase/supabase-js'

export function createAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!, // Secret key
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    }
  )
}
```

- [ ] **Step 2: Commit setup**

Run: `git add src/lib/supabase/admin.ts && git commit -m "feat: add supabase admin client for user management"`

---

### Task 2: Auth Server Actions (Login & Logout)

**Files:**
- Create: `src/actions/auth.ts`

- [ ] **Step 1: Implement Login Action using createClient (server.ts)**

```typescript
// src/actions/auth.ts
'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function login(formData: FormData) {
  const supabase = createClient()
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  const { error } = await supabase.auth.signInWithPassword({ email, password })

  if (error) {
    redirect('/login?error=Invalid credentials')
  }

  revalidatePath('/', 'layout')
  redirect('/admin')
}

export async function logout() {
  const supabase = createClient()
  await supabase.auth.signOut()
  revalidatePath('/', 'layout')
  redirect('/login')
}
```

- [ ] **Step 2: Commit actions**

Run: `git add src/actions/auth.ts && git commit -m "feat: add login and logout server actions"`

---

### Task 3: Login Page UI

**Files:**
- Create: `src/app/login/page.tsx`

- [ ] **Step 1: Create Login UI with TailwindCSS**

```tsx
// src/app/login/page.tsx
import { login } from '@/actions/auth'

export default function LoginPage({ searchParams }: { searchParams: { error?: string } }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">Login Admin Desa</h2>
        
        {searchParams.error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-6 text-sm text-center">
            {searchParams.error}
          </div>
        )}

        <form action={login} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <input name="email" type="email" required className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
            <input name="password" type="password" required className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all" />
          </div>
          <button type="submit" className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition-colors shadow-lg">
            Masuk ke Dashboard
          </button>
        </form>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Commit login page**

Run: `git add src/app/login && git commit -m "feat: implement login page UI"`

---

### Task 4: Route Protection (Middleware)

**Files:**
- Create: `src/middleware.ts`

- [ ] **Step 1: Implement Middleware to protect /admin routes**

```typescript
// src/middleware.ts
import { type NextRequest } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'

export async function middleware(request: NextRequest) {
  return await updateSession(request)
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
```

- [ ] **Step 2: Update middleware.ts logic to redirect unauthenticated users away from /admin**

(Update `src/lib/supabase/middleware.ts` logic if necessary to include redirect logic)

- [ ] **Step 3: Commit middleware**

Run: `git add src/middleware.ts && git commit -m "feat: add middleware for route protection"`

---

### Task 5: Admin Invite Action

**Files:**
- Modify: `src/actions/auth.ts`

- [ ] **Step 1: Add inviteUser action using createAdminClient**

```typescript
// src/actions/auth.ts (Append)
import { createAdminClient } from '@/lib/supabase/admin'

export async function inviteAdmin(email: string) {
  const adminClient = createAdminClient()
  
  const { data, error } = await adminClient.auth.admin.inviteUserByEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
    data: { role: 'admin' }
  })

  if (error) throw error
  return data
}
```

- [ ] **Step 2: Commit invite action**

Run: `git commit -am "feat: add admin invitation server action"`
