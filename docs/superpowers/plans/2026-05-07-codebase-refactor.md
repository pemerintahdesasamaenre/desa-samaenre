# Codebase Refactor (KISS, YAGNI, DRY) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Standardize admin routes, transition to Server Components for data fetching, and centralize validation schemas to improve maintainability and performance.

**Architecture:** Use Next.js Server Components for data fetching in admin list pages. Centralize all Zod schemas in a single validation file. Standardize Server Actions using a consistent protection wrapper.

**Tech Stack:** Next.js (App Router), Supabase, Zod, Tailwind CSS.

---

### Task 1: Centralize Category Schema & Refactor Category Actions

**Files:**
- Modify: `src/lib/validations/index.ts`
- Modify: `src/actions/categories.ts`

- [x] **Step 1: Add categorySchema to centralized validations**

Move the schema from `actions/categories.ts` to `lib/validations/index.ts`.

```typescript
// src/lib/validations/index.ts
export const categorySchema = z.object({
  name: z.string().min(2, "Nama minimal 2 karakter"),
  slug: z.string().min(2, "Slug minimal 2 karakter"),
  type: z.enum(['post', 'demographic', 'finance', 'gallery']),
  description: z.string().optional(),
})

export type CategoryInput = z.infer<typeof categorySchema>
```

- [x] **Step 2: Refactor Category Actions**

Update `src/actions/categories.ts` to import the schema and ensure all actions are consistent.

- [x] **Step 3: Verify Category Actions**

Run tests or verify manually via admin UI.

- [x] **Step 4: Commit**

```bash
git add src/lib/validations/index.ts src/actions/categories.ts
git commit -m "refactor: centralize category schema and standardize actions"
```

### Task 2: Standardize Resident Actions & Cleanup

**Files:**
- Modify: `src/actions/residents.ts`

- [x] **Step 1: Clean up redundant interfaces and imports**

Ensure `getAuthUser` and `protectedAction` (if applicable) are used consistently. Remove `ResidentImportData` and `ResidentDisplayData` if they are redundant with `ResidentInput` or `Resident` types.

- [x] **Step 2: Refactor upsertResident**

Ensure it uses `protectedAction` and returns a consistent error format.

- [x] **Step 3: Commit**

```bash
git add src/actions/residents.ts
git commit -m "refactor: standardize resident actions and cleanup"
```

### Task 3: Refactor Posts Page to Server Component

**Files:**
- Modify: `src/app/admin/posts/page.tsx`
- Modify: `src/components/modules/posts/PostTable.tsx` (if needed for prop changes)

- [x] **Step 1: Convert page.tsx to Async Server Component**

Remove `useState`, `useEffect`, and fetch data directly.

```tsx
// src/app/admin/posts/page.tsx
import { getPosts } from '@/actions/posts';
// ... imports

export default async function AdminPostsPage() {
  const posts = await getPosts();
  return (
    <div className="space-y-6 sm:space-y-8 pb-20">
      {/* ... header ... */}
      <PostTable posts={posts} isLoading={false} />
    </div>
  );
}
```

- [x] **Step 2: Verify page functionality**

- [x] **Step 3: Commit**

```bash
git add src/app/admin/posts/page.tsx
git commit -m "refactor: convert admin posts page to server component"
```

### Task 4: Refactor Staff Page to Server Component

**Files:**
- Modify: `src/app/admin/staff/page.tsx`

- [x] **Step 1: Convert page.tsx to Async Server Component**

Fetch all staff on server. Filter logic for tabs can remain client-side in a wrapper if needed, or handle with search params for better KISS/YAGNI.

- [x] **Step 2: Commit**

```bash
git add src/app/admin/staff/page.tsx
git commit -m "refactor: convert admin staff page to server component"
```

### Task 5: Route Normalization & Final Cleanup

**Files:**
- Delete: Redundant route directories (e.g. `src/app/admin/categories/[id]/edit` or `src/app/admin/posts/[id]/edit`)
- Modify: Links in components (Header, Sidebar, Tables) to point to normalized routes.

- [x] **Step 1: Identify and delete redundant directories**

- [x] **Step 2: Update navigation links**

- [x] **Step 3: Final verification and linting**

Run: `npm run lint`

- [x] **Step 4: Commit**

```bash
git commit -m "refactor: normalize admin routes and final cleanup"
```
