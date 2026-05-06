# Spec: Codebase Refactor for KISS, YAGNI, and DRY

**Date:** 2026-05-07
**Topic:** Refactoring Admin Module and Server Actions

## 1. Overview
The current codebase has several inconsistencies and redundancies that hinder maintainability. This refactor aims to apply KISS (Keep It Simple, Stupid), YAGNI (You Ain't Gonna Need It), and DRY (Don't Repeat Yourself) principles to the admin module and server actions.

## 2. Goals
- Standardize route patterns for editing records.
- Transition admin list pages from Client-side fetching to Server-side fetching.
- Centralize all Zod validation schemas.
- Ensure all mutation actions use a consistent protection wrapper.
- Remove redundant and unused code/directories.

## 3. Architecture & Standards

### 3.1. Route Pattern Standardization
Currently, modules like `categories` and `posts` use mixed patterns:
- `admin/module/[id]/edit`
- `admin/module/edit/[id]`

**Standard:** All edit routes will use `admin/[module]/edit/[id]`.
Redundant directories will be removed.

### 3.2. Data Fetching (Server Components)
Admin list pages (e.g., `admin/posts`, `admin/staff`) currently use `useEffect` and Client-side state.
**Refactor:** Convert these to Server Components. Fetch data directly in the page component using server actions or a data service.

### 3.3. Validation Schemas (Single Source of Truth)
Some actions (like `categories.ts`) define schemas locally, while others are in `lib/validations/index.ts`.
**Refactor:** All schemas MUST reside in `src/lib/validations/index.ts`. Actions will import them from there.

### 3.4. Server Action Standardization
All mutation actions (create, update, delete) must use the `protectedAction` helper from `src/lib/utils/action-handler.ts` to ensure consistent auth and error handling.

## 4. Implementation Strategy

### Phase 1: Schema & Action Cleanup
1. Move `categorySchema` to `lib/validations`.
2. Update `src/actions/categories.ts` to use `protectedAction` and the centralized schema.
3. Clean up `src/actions/residents.ts` (currently has mixed styles and redundant interfaces).

### Phase 2: Route & Page Refactoring
1. Move `src/app/admin/categories/[id]/edit` to `src/app/admin/categories/edit/[id]` (if not already there or if redundant).
2. Refactor `src/app/admin/posts/page.tsx` and `src/app/admin/staff/page.tsx` to be Server Components.
3. Remove redundant route folders.

### Phase 3: General Cleanup (YAGNI)
1. Scan for unused services or utility functions.
2. Ensure consistent labeling and translation across admin pages.

## 5. Success Criteria
- No duplicate route patterns for the same functionality.
- No `useEffect` for initial data fetching in admin list pages.
- All Zod schemas centralized in `lib/validations`.
- All mutation actions wrapped in `protectedAction`.
- Build and lint pass without errors.
