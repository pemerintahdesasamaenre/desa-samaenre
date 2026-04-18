# Admin CRUD Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Membangun fitur CRUD lengkap di dashboard admin untuk mengelola data Info Desa dan Demografi Penduduk langsung ke Supabase.

**Architecture:** Menggunakan Server Actions untuk mutasi data dan `revalidatePath` untuk update UI instan. Form validasi menggunakan Zod.

**Tech Stack:** Next.js 14, Supabase, TailwindCSS, Zod, Lucide React.

---

### Task 1: Demographic CRUD Server Actions

**Files:**
- Create: `src/actions/demographics.ts`

- [x] **Step 1: Implement Create, Update, and Delete actions**

```typescript
// src/actions/demographics.ts
'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { demographicSchema } from '@/lib/validations'

export async function createDemographic(data: any) {
  const supabase = await createClient()
  const validated = demographicSchema.parse(data)
  
  const { error } = await supabase.from('demographics').insert(validated)
  if (error) throw error
  
  revalidatePath('/admin/statistics')
  revalidatePath('/')
}

export async function updateDemographic(id: string, data: any) {
  const supabase = await createClient()
  const validated = demographicSchema.parse(data)
  
  const { error } = await supabase.from('demographics').update(validated).eq('id', id)
  if (error) throw error
  
  revalidatePath('/admin/statistics')
  revalidatePath('/')
}

export async function deleteDemographic(id: string) {
  const supabase = await createClient()
  const { error } = await supabase.from('demographics').delete().eq('id', id)
  if (error) throw error
  
  revalidatePath('/admin/statistics')
  revalidatePath('/')
}
```

- [x] **Step 2: Commit actions**

Run: `git add src/actions/demographics.ts && git commit -m "feat: add demographic crud server actions"`

---

### Task 2: Village Info CRUD Server Actions

**Files:**
- Create: `src/actions/village-info.ts`

- [ ] **Step 1: Implement Update Village Info action**

```typescript
// src/actions/village-info.ts
'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { villageInfoSchema } from '@/lib/validations'

export async function updateVillageInfo(id: number, data: any) {
  const supabase = await createClient()
  const validated = villageInfoSchema.parse(data)
  
  const { error } = await supabase.from('village_info').update(validated).eq('id', id)
  if (error) throw error
  
  revalidatePath('/admin')
  revalidatePath('/')
}
```

- [ ] **Step 2: Commit actions**

Run: `git add src/actions/village-info.ts && git commit -m "feat: add village info update action"`

---

### Task 3: Admin Statistics Page (Table View)

**Files:**
- Create: `src/app/admin/statistics/page.tsx`

- [ ] **Step 1: Create a table UI to list all demographics data from Supabase**

- [ ] **Step 2: Implement "Delete" button with confirmation**

- [ ] **Step 3: Commit page**

Run: `git add src/app/admin/statistics/page.tsx && git commit -m "feat: implement admin statistics list page"`

---

### Task 4: Demographic Form (Add/Edit)

**Files:**
- Create: `src/components/modules/statistics/DemographicForm.tsx`

- [ ] **Step 1: Build a reusable form component using Zod and Server Actions**

- [ ] **Step 2: Integrate form into the statistics page (Add & Edit modes)**

- [ ] **Step 3: Commit form component**

Run: `git add src/components/modules/statistics/DemographicForm.tsx && git commit -m "feat: add demographic form component"`
