# Spec: Profile Settings Page

## Overview
Implement a settings page in the admin dashboard where users can update their personal profile information.

## Goals
- Allow users to update: Full Name, NIP, Position, Phone, and Address.
- Restrict users from updating their own Email or Role (these are managed by system admins in User Management).
- Provide a clean, consistent UI that matches the existing admin dashboard.

## Architecture
- **Page**: `src/app/admin/settings/page.tsx` (Server Component)
- **Component**: `src/components/modules/users/ProfileForm.tsx` (Client Component)
- **Data Action**: `updateProfile` from `@/actions/users`

## Data Flow
1. User navigates to `/admin/settings`.
2. `page.tsx` fetches the current session using `supabase.auth.getUser()`.
3. `page.tsx` fetches the corresponding profile from the `profiles` table.
4. Profile data is passed to `ProfileForm.tsx`.
5. User updates fields and submits.
6. `ProfileForm.tsx` calls `updateProfile(userId, data)`.
7. Success/Error notifications are shown via `sonner`.

## UI Design
- The page will use a card-based layout.
- Icons from `lucide-react` will be used for input fields (matching `UserForm.tsx`).
- Fields:
  - Full Name (required)
  - NIP (optional)
  - Position (required)
  - Phone (required)
  - Address (optional, textarea)
- Email and Role will be displayed as read-only or not shown at all to avoid confusion.

## Testing Strategy
- Verify that current user data is correctly pre-filled.
- Verify that `updateProfile` correctly updates the `profiles` table.
- Verify that email and role cannot be changed via this form.
- Verify that notifications appear correctly on success/error.
