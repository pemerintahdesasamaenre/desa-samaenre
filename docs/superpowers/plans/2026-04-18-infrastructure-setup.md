# Profil Desa Infrastructure Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Setup pondasi teknis Next.js 14, Supabase integration, dan migrasi database modular untuk Profil Desa.

**Architecture:** Layered Architecture dengan Server Components untuk fetching dan Server Actions untuk mutasi. Menggunakan pola SSR dari Supabase (@supabase/ssr).

**Tech Stack:** Next.js 14, TypeScript (Strict), Supabase, Zod, Vitest (untuk testing).

---

### Task 1: Project Initialization & Strict TS Config

**Files:**
- Create: `package.json`
- Create: `tsconfig.json`
- Create: `.eslintrc.json`

- [ ] **Step 1: Initialize Next.js project with specific flags**

Run: `npx create-next-app@latest . --ts --eslint --app --src-dir --import-alias "@/*" --no-tailwind`

- [ ] **Step 2: Update tsconfig.json to enforce strict types**

Modify `tsconfig.json`:
```json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "exactOptionalPropertyTypes": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    // ... rest of config
  }
}
```

- [ ] **Step 3: Setup Vitest for TDD**

Run: `npm install -D vitest @vitejs/plugin-react jsdom @testing-library/react @testing-library/jest-dom`

- [ ] **Step 4: Commit initialization**

Run: `git add . && git commit -m "chore: initial project setup with strict typescript and vitest"`

---

### Task 2: Supabase Integration Setup (@supabase/ssr)

**Files:**
- Create: `src/lib/supabase/server.ts`
- Create: `src/lib/supabase/client.ts`
- Create: `src/lib/supabase/middleware.ts`
- Create: `.env.local`

- [ ] **Step 1: Install Supabase dependencies**

Run: `npm install @supabase/ssr @supabase/supabase-js`

- [ ] **Step 2: Create Supabase Server Client**

```typescript
// src/lib/supabase/server.ts
import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'

export function createClient() {
  const cookieStore = cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value, ...options })
          } catch (error) {
            // Handle middleware set
          }
        },
        remove(name: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value: '', ...options })
          } catch (error) {
            // Handle middleware remove
          }
        },
      },
    }
  )
}
```

- [ ] **Step 3: Commit Supabase setup**

Run: `git add src/lib/supabase && git commit -m "feat: setup supabase ssr clients"`

---

### Task 3: Database Schema Migration & RLS

**Files:**
- Create: `supabase/migrations/20260418000000_initial_schema.sql`

- [ ] **Step 1: Write SQL migration for modular categories and core tables**

```sql
-- supabase/migrations/20260418000000_initial_schema.sql

-- Enable UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Categories Table
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  type TEXT NOT NULL,
  description TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Profiles Table
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  full_name TEXT,
  role TEXT DEFAULT 'admin',
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Demographics Table
CREATE TABLE demographics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  category_id UUID REFERENCES categories(id) ON DELETE CASCADE,
  label TEXT NOT NULL,
  value INTEGER NOT NULL DEFAULT 0,
  metadata JSONB DEFAULT '{}',
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE demographics ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Public read access for categories" ON categories FOR SELECT USING (true);
CREATE POLICY "Public read access for demographics" ON demographics FOR SELECT USING (true);
CREATE POLICY "Admin full access for categories" ON categories FOR ALL USING (auth.uid() IN (SELECT id FROM profiles WHERE role = 'admin'));
```

- [ ] **Step 2: Commit migrations**

Run: `git add supabase/migrations && git commit -m "feat: add initial database schema and rls policies"`

---

### Task 4: Base Types & Zod Schemas

**Files:**
- Create: `src/types/database.ts`
- Create: `src/lib/validations/index.ts`

- [ ] **Step 1: Define TypeScript interfaces for Core Models (Manual for now)**

```typescript
// src/types/index.ts
export type CategoryType = 'post' | 'demographic' | 'finance' | 'gallery';

export interface Category {
  id: string;
  name: string;
  slug: string;
  type: CategoryType;
  description?: string;
  metadata?: Record<string, any>;
}

export interface Demographic {
  id: string;
  category_id: string;
  label: string;
  value: number;
  metadata?: Record<string, any>;
}
```

- [ ] **Step 2: Create Zod schemas for validation**

```typescript
// src/lib/validations/demographic.ts
import { z } from 'zod';

export const demographicSchema = z.object({
  category_id: z.string().uuid(),
  label: z.string().min(1, "Label is required"),
  value: z.number().int().nonnegative(),
  metadata: z.record(z.any()).optional(),
});
```

- [ ] **Step 3: Commit types and validations**

Run: `git add src/types src/lib/validations && git commit -m "feat: add base types and zod validation schemas"`
