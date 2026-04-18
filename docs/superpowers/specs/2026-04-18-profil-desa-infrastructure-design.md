# Design Spec: Profil Desa Infrastructure

**Date:** 2026-04-18
**Topic:** Infrastructure & Database Design for Village Profile (Company Profile Context)
**Status:** Draft

## 1. Overview
Membangun platform Profil Desa modern dengan standar *company profile* yang informatif, cepat, dan mudah dikelola oleh admin desa. Fokus utama adalah pada transparansi data statistik, berita, dan profil aparatur desa.

## 2. Tech Stack
- **Framework:** Next.js 14+ (App Router)
- **Language:** TypeScript (Strict Mode)
- **Database & Auth:** Supabase (PostgreSQL)
- **Styling:** Vanilla CSS (TailwindCSS avoided unless requested later)
- **Deployment:** Vercel
- **Data Fetching:** Server Components + `@supabase/ssr`
- **Mutations:** Server Actions + `zod` for validation

## 3. Database Schema (Supabase)

### 3.1. Modular Categories System
Tabel ini digunakan sebagai sistem klasifikasi tunggal untuk berbagai modul.
```sql
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  type TEXT NOT NULL, -- 'post', 'demographic', 'finance', 'gallery'
  description TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 3.2. Core Modules
- **`profiles`**: User management (RBAC ready).
  - `id` (UUID, PK, links to auth.users)
  - `full_name` (TEXT)
  - `role` (TEXT, default 'admin')
  - `updated_at` (TIMESTAMP)

- **`village_info`**: Static/Semi-static village profile.
  - `id` (SERIAL, PK)
  - `name` (TEXT)
  - `vision` (TEXT)
  - `mission` (JSONB) -- Array of mission strings
  - `history` (TEXT)
  - `contact_info` (JSONB) -- { email, phone, address, maps_url }
  - `updated_at` (TIMESTAMP)

- **`posts`**: Articles, News, Announcements.
  - `id` (UUID, PK)
  - `category_id` (UUID, FK -> categories)
  - `author_id` (UUID, FK -> profiles)
  - `title` (TEXT)
  - `slug` (TEXT, UNIQUE)
  - `content` (TEXT)
  - `image_url` (TEXT)
  - `is_published` (BOOLEAN, default false)
  - `created_at` (TIMESTAMP)

- **`demographics`**: Detailed statistical data.
  - `id` (UUID, PK)
  - `category_id` (UUID, FK -> categories) -- e.g., 'Pekerjaan', 'Agama'
  - `label` (TEXT) -- e.g., 'Petani', 'Islam'
  - `value` (INTEGER)
  - `metadata` (JSONB) -- { gender: 'L/P', hamlet: 'Dusun A' }
  - `updated_at` (TIMESTAMP)

- **`staff_members`**: Organization structure.
  - `id` (UUID, PK)
  - `name` (TEXT)
  - `position` (TEXT)
  - `photo_url` (TEXT)
  - `order_index` (INTEGER)

- **`finances`**: Budget transparency.
  - `id` (UUID, PK)
  - `year` (INTEGER)
  - `type` (TEXT) -- 'income', 'expense'
  - `category_id` (UUID, FK -> categories)
  - `amount` (BIGINT)
  - `description` (TEXT)

## 4. Security & Quality Standards
- **Strict TypeScript:**
  - `noImplicitAny: true`
  - `strict: true`
- **Supabase RLS (Row Level Security):**
  - Public can `SELECT` from all tables except `profiles` (limited view).
  - Only authenticated users with `role: admin` can `INSERT`, `UPDATE`, `DELETE`.
- **Validation:** Server Actions must validate payload using `zod` schemas matching the database types.

## 5. Implementation Phases
- **Phase 1:** Setup Next.js, Supabase, and Strict TS Config.
- **Phase 2:** Database Migration & RLS Setup.
- **Phase 3:** Core Services (Fetchers) & Server Actions (Mutations).
- **Phase 4:** Manual Admin Dashboard (MVP for data entry).
- **Phase 5:** Public Website Layout & Content Display.
- **Phase 6:** Advanced features (Dynamic CSV Upload, Charts).
