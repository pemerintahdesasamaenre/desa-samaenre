# Design Spec: Login Redesign & Branding Refinement

- **Date:** 2026-05-14
- **Topic:** Login UI, Branding, and Global Metadata
- **Status:** Draft

## 1. Overview
Redesign the login page to match the premium aesthetic of the admin dashboard and refine global metadata to reflect actual village branding instead of generic placeholders.

## 2. Goals
- Create a modern, high-conversion login page using Glassmorphism.
- Provide clear user feedback (loading states) during login.
- Use village-specific imagery (hero banner) as login background.
- Refactor `layout.tsx` metadata for cleaner, more professional branding.
- Implement dynamic title templates based on the village name.

## 3. Technical Architecture

### 3.1 Login Page (`src/app/login/page.tsx`)
- **Server Component**: Fetches `village_info` to get the `header_banner_url` and `logo_url`.
- **Client Component (`LoginForm`)**: Encapsulates the form logic, managing loading state with `useFormStatus` or local `useState`.

### 3.3 Data Flow
1. `LoginPage` (Server Component) calls `getVillageInfo()` from `data-service.ts`.
2. `header_banner_url` and `logo_url` are passed as props to the UI components.
3. `LoginForm` (Client Component) handles user input and loading states using `useActionState`.

## 4. UI Design

### 4.1 Login Visuals
- **Background**: `header_banner_url` with `blur-xl` and `bg-black/40` overlay.
- **Card**: Glassmorphism effect:
    - `bg-white/10` (dark mode) or `bg-white/30` (light mode).
    - `backdrop-blur-2xl`.
    - `border-white/20`.
    - `rounded-[2rem]` or `rounded-[3rem]`.
    - Shadow: `shadow-2xl`.
- **Branding**:
    - Display `logo_url` at the top of the card.
    - Display village name prominently above the login form.
- **Feedback**: 
    - "Masuk" button shows a spinner and text "Memproses..." when `pending`.
    - Error messages displayed in a coherent glassmorphism style or standard alert.

### 4.2 Metadata Improvements
- **Title**: Change "Desa Digital" to "Desa Samaenre".
- **Description**: Focused on "Transparansi", "Informasi Publik", and "Pelayanan Masyarakat".
- **Keywords**: Refine to include local village context.

## 5. Implementation Plan
1. **Metadata Update**:
    - Edit `src/app/layout.tsx`.
    - Update `title`, `description`, `keywords`, `creator`, and `openGraph`/`twitter` fields.
2. **Auth Component**:
    - Create `src/components/modules/auth/LoginForm.tsx`.
    - Implement `useActionState` for handling the `login` action.
    - Add loading spinner and "Memproses..." state.
3. **Login Page Refactor**:
    - Update `src/app/login/page.tsx`.
    - Fetch `village_info` server-side.
    - Implement the background-blur layout.
    - Integrate `LoginForm`.
4. **Verification**:
    - Test login flow (success/failure).
    - Check mobile responsiveness.
    - Verify metadata using `view-source` or social media preview tools.

## 6. Verification & Success Criteria

### 6.1 Success Criteria
- [ ] Login page matches the proposed glassmorphism design.
- [ ] Login background dynamically uses the village's header banner.
- [ ] Loading state is visible during authentication.
- [ ] Metadata correctly identifies "Desa Samaenre".
- [ ] No regressions in authentication logic.

### 6.2 Test Cases
| ID | Case | Expected Result |
|----|------|-----------------|
| TC-01 | Successful Login | Redirects to `/admin` with valid credentials. |
| TC-02 | Failed Login | Shows error message, button returns to "Masuk". |
| TC-03 | Responsive Check | Layout is centered and readable on mobile devices. |
| TC-04 | Metadata Check | `<title>` shows "Website Resmi Desa Samaenre". |
| TC-05 | No Image Fallback | Background uses a solid color if `header_banner_url` is missing. |

## 7. Future Considerations
- Implement dynamic metadata fetching in `layout.tsx` (using `generateMetadata`) to support multi-tenant or multi-village profiles without hardcoding.
- Add "Lupa Kata Sandi" link (requires further Supabase Auth setup).
