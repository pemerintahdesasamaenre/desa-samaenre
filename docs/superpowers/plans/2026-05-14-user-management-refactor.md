# User Management & Profile CRUD Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Refactor user management from invitation-only to full CRUD with extended profile data and a personal settings page.

**Architecture:** Extend the `profiles` table to store personal data, implement Supabase Admin Auth for direct user creation, and create server actions for CRUD operations. Use a modular UI with reusable form components.

**Tech Stack:** Next.js (TypeScript), Supabase Auth/DB, Zod for validation, Sonner for toasts.

---

### Task 1: Database Schema & Trigger Update

**Files:**
- Modify: `supabase/migrations/0000_merged_schema.sql`

- [ ] **Step 1: Update SQL schema**
Append the column additions and update the trigger function in `0000_merged_schema.sql`.

```sql
-- Append to end of Bagian 2 (Residents & Security) or Bagian 1
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS nip TEXT,
ADD COLUMN IF NOT EXISTS position TEXT,
ADD COLUMN IF NOT EXISTS phone TEXT,
ADD COLUMN IF NOT EXISTS address TEXT,
ADD COLUMN IF NOT EXISTS avatar_url TEXT;

-- Update trigger in Bagian 4
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, role, nip, position, phone)
  VALUES (
    new.id, 
    COALESCE(new.raw_user_meta_data->>'full_name', 'User Baru'), 
    COALESCE(new.raw_user_meta_data->>'role', 'admin'),
    new.raw_user_meta_data->>'nip',
    new.raw_user_meta_data->>'position',
    new.raw_user_meta_data->>'phone'
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;
```

- [ ] **Step 2: Apply SQL changes manually to Supabase Dashboard**
Copy the SQL above and run it in the Supabase SQL Editor.

- [ ] **Step 3: Commit migration file update**
```bash
git add supabase/migrations/0000_merged_schema.sql
git commit -m "db: extend profiles table and update user creation trigger"
```

### Task 2: Implement User Management Server Actions

**Files:**
- Create: `src/actions/users.ts`
- Modify: `src/actions/auth.ts`

- [ ] **Step 1: Create `src/actions/users.ts`**
Implement CRUD actions using Supabase Admin Client.

```typescript
'use server'

import { createAdminClient } from '@/lib/supabase/admin'
import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function createUser(data: any) {
  const supabase = createAdminClient()
  const { email, password, full_name, role, nip, position, phone } = data

  const { data: user, error } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { full_name, role, nip, position, phone }
  })

  if (error) return { error: error.message }
  
  revalidatePath('/admin/users')
  return { data: user }
}

export async function deleteUser(id: string) {
  const supabase = createAdminClient()
  const { error } = await supabase.auth.admin.deleteUser(id)
  
  if (error) return { error: error.message }
  
  revalidatePath('/admin/users')
  return { success: true }
}

export async function updateProfile(id: string, data: any) {
  const supabase = await createClient()
  const { error } = await supabase
    .from('profiles')
    .update(data)
    .eq('id', id)

  if (error) return { error: error.message }
  
  revalidatePath('/admin/users')
  revalidatePath('/admin/settings')
  return { success: true }
}
```

- [ ] **Step 2: Commit actions**
```bash
git add src/actions/users.ts
git commit -m "feat: add user management server actions"
```

### Task 3: Refactor User Management UI

**Files:**
- Create: `src/components/modules/users/UserForm.tsx`
- Modify: `src/app/admin/users/page.tsx`
- Modify: `src/components/modules/users/UserTable.tsx`

- [ ] **Step 1: Create `UserForm.tsx`**
Create a form that handles both Creation and Editing.

- [ ] **Step 2: Update `AdminUsersPage`**
Replace `InviteForm` with a state-managed `UserForm` or a modal trigger.

- [ ] **Step 3: Update `UserTable`**
Add Edit and Delete buttons that trigger the appropriate actions.

- [ ] **Step 4: Commit UI changes**
```bash
git add src/components/modules/users/ src/app/admin/users/page.tsx
git commit -m "feat: implement user CRUD UI"
```

### Task 4: Profile Settings Page

**Files:**
- Create: `src/app/admin/settings/page.tsx`
- Create: `src/components/modules/users/ProfileForm.tsx`

- [ ] **Step 1: Implement `ProfileForm.tsx`**
Form for users to update their own data (NIP, Phone, Address).

- [ ] **Step 2: Create `/admin/settings` page**
Fetch the current user's profile and pass it to the form.

- [ ] **Step 3: Commit settings page**
```bash
git add src/app/admin/settings/page.tsx src/components/modules/users/ProfileForm.tsx
git commit -m "feat: add profile settings page"
```
