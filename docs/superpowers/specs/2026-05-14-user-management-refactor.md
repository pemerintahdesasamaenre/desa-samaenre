# Design Spec: User Management & Profile CRUD Refactoring

- **Date:** 2026-05-14
- **Topic:** User Management, Profiles, and Account Settings
- **Status:** Draft

## 1. Overview
Refactor the existing invitation-only user system into a comprehensive CRUD (Create, Read, Update, Delete) management system. This includes extending the `profiles` table to store personal data and creating a dedicated settings page for users to manage their own profiles.

## 2. Goals
- Replace `InviteForm` with a direct `CreateUser` workflow using Supabase Admin Auth.
- Extend `profiles` table with NIP, Position, Phone, Address, and Avatar.
- Implement full CRUD operations for administrators to manage team members.
- Implement a "My Profile" settings page for personal data updates.
- Ensure data synchronization between `auth.users` and `public.profiles`.

## 3. Technical Architecture

### 3.1 Data Schema Updates (Supabase SQL)
```sql
-- Extend profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS nip TEXT,
ADD COLUMN IF NOT EXISTS position TEXT,
ADD COLUMN IF NOT EXISTS phone TEXT,
ADD COLUMN IF NOT EXISTS address TEXT,
ADD COLUMN IF NOT EXISTS avatar_url TEXT;

-- Update trigger function to handle metadata during creation
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

### 3.2 Server Actions (`src/actions/users.ts`)
- `createUser(data)`: Uses `supabase.auth.admin.createUser` with metadata.
- `updateUser(id, data)`: Updates `profiles` table and optionally `auth.users` metadata.
- `deleteUser(id)`: Uses `supabase.auth.admin.deleteUser` (cascades to profile).
- `updateSelfProfile(data)`: Allows logged-in users to update their own profile fields.

### 3.3 Components & Pages
- **`/admin/users`**: 
    - Updated `UserTable` with edit/delete actions.
    - `UserForm` (Modal/New Page) replacing `InviteForm`.
- **`/admin/settings`**: 
    - Profile management form.
    - Avatar upload integration with Supabase Storage (`avatars` bucket).
    - Password change functionality.

## 4. UI Design
- **Form Organization**: Group fields into "Account Info" (Email, Role) and "Personal Info" (Name, NIP, Position, Contact).
- **Feedback**: Use `sonner` for success/error toasts.
- **Security**: Use `ConfirmDialog` for destructive actions like user deletion.

## 5. Security & Validation
- **Access Control**: Only users with `role: 'admin'` can access `/admin/users` and administrative CRUD actions.
- **Validation**: Zod schemas for NIP (numeric), Phone (ID format), and Email.
- **Integrity**: `ON DELETE CASCADE` ensures `profiles` are cleaned up when an auth user is deleted.

## 6. Implementation Plan Highlights
1. Execute SQL migrations to update table and trigger.
2. Create `src/actions/users.ts` and update `src/actions/auth.ts`.
3. Build `UserForm` component for Create/Edit operations.
4. Update `UserTable` to support actions.
5. Implement `/admin/settings` page.
6. Test full lifecycle: Create -> Login -> Update Profile -> Delete.
