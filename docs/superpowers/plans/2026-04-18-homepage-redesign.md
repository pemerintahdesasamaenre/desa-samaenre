# Homepage Redesign - Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** To implement the new "Village Dashboard" homepage design by creating a series of modular React components and composing them in the main `page.tsx`.

**Architecture:** We will create separate Server Components for each major section of the homepage. The main `page.tsx` will be responsible for fetching all required data from the database via Server Actions and passing it down to these child components. This keeps our data-fetching logic centralized and our UI components clean and focused.

**Tech Stack:** Next.js (App Router), React, TypeScript, Supabase, Tailwind CSS, Lucide React.

---

### Task 1: Update Data Service for Homepage
Before building the UI, we need to ensure we can fetch all the necessary data. We will add a new function to `src/services/data-service.ts` to aggregate all data needed for the homepage in one efficient query.

**Files:**
- Modify: `src/services/data-service.ts`

- [ ] **Step 1: Add `getHomepageData` function**
This function will fetch the village name, population, budget, hamlet count, staff count, and latest posts.

```typescript
// In src/services/data-service.ts, add the following function:

export async function getHomepageData() {
  const supabase = await createClient();

  const villageInfoPromise = supabase.from('village_info').select('name').single();
  
  const populationPromise = supabase
    .from('demographics')
    .select('value')
    .eq('label', 'Total Populasi')
    .single();

  const budgetPromise = supabase
    .from('finances')
    .select('amount')
    .eq('type', 'income')
    .eq('year', new Date().getFullYear());

  const hamletsPromise = supabase
    .from('demographics')
    .select('id', { count: 'exact' })
    .eq('category_id', 'c3d4e5f6-a7b8-9012-3456-7890abcdef01'); // Assuming 'populasi' category id is stable

  const staffCountPromise = supabase
    .from('staff_members')
    .select('id', { count: 'exact' });

  const postsPromise = supabase
    .from('posts')
    .select('title, slug, created_at, categories(name)')
    .eq('status', 'published')
    .order('created_at', { ascending: false })
    .limit(3);
    
  const staffPromise = supabase
    .from('staff_members')
    .select('name, position, photo_url')
    .in('position', ['Kepala Desa', 'Sekretaris Desa'])
    .limit(4);

  const [
    villageInfo,
    population,
    budget,
    hamlets,
    staffCount,
    posts,
    staff
  ] = await Promise.all([
    villageInfoPromise,
    populationPromise,
    budgetPromise,
    hamletsPromise,
    staffCountPromise,
    postsPromise,
    staffPromise
  ]);

  const totalBudget = budget.data?.reduce((sum, item) => sum + item.amount, 0) || 0;

  return {
    villageName: villageInfo.data?.name || 'Desa',
    population: population.data?.value || 0,
    budget: totalBudget,
    hamletCount: hamlets.count || 0,
    staffCount: staffCount.count || 0,
    posts: posts.data || [],
    staff: staff.data || [],
  };
}
```

### Task 2: Create Homepage Components
We will now create the individual React components for each section.

**Files:**
- Create: `src/components/modules/home/HeroSection.tsx`
- Create: `src/components/modules/home/StatGrid.tsx`
- Create: `src/components/modules/home/LatestPosts.tsx`
- Create: `src/components/modules/home/VillageApparatus.tsx`

- [ ] **Step 1: Create `HeroSection.tsx`**
This component will display the main welcome message and background image.

```tsx
// src/components/modules/home/HeroSection.tsx
import Link from 'next/link';

interface HeroSectionProps {
  villageName: string;
}

export default function HeroSection({ villageName }: HeroSectionProps) {
  return (
    <div className="relative h-[60vh] min-h-[400px] flex items-center justify-center text-center text-white bg-slate-800">
      <div className="absolute inset-0 bg-black opacity-50 z-10"></div>
      {/* Placeholder for background image */}
      <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url('/placeholder-bg.jpg')" }}></div>
      
      <div className="relative z-20 px-4">
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
          Selamat Datang di {villageName}
        </h1>
        <p className="mt-4 text-lg md:text-xl max-w-3xl mx-auto text-slate-200">
          Situs resmi untuk informasi, transparansi, dan layanan publik Desa {villageName}.
        </p>
        <div className="mt-8">
          <Link href="/tentang" className="px-8 py-3 bg-blue-600 hover:bg-blue-700 rounded-xl font-bold transition-all shadow-lg">
            Jelajahi Profil Desa
          </Link>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Create `StatGrid.tsx`**
This component will display the four key statistics cards.

```tsx
// src/components/modules/home/StatGrid.tsx
import { StatCard } from '@/components/ui/StatCard';
import { Users, Wallet, MapPin } from 'lucide-react';

interface StatGridProps {
  population: number;
  budget: number;
  hamletCount: number;
  staffCount: number;
}

export default function StatGrid({ population, budget, hamletCount, staffCount }: StatGridProps) {
  return (
    <div className="bg-slate-50 dark:bg-slate-900 py-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 -mt-24 relative z-20">
          <StatCard icon={<Users />} label="Total Penduduk" value={population.toLocaleString()} unit="Jiwa" />
          <StatCard icon={<Wallet />} label={`Anggaran ${new Date().getFullYear()}`} value={`Rp ${Math.round(budget / 1_000_000)} Jt`} unit="Total Pendapatan" />
          <StatCard icon={<MapPin />} label="Jumlah Dusun" value={hamletCount.toLocaleString()} unit="Wilayah" />
          <StatCard icon={<Users />} label="Aparatur Desa" value={staffCount.toLocaleString()} unit="Orang" />
        </div>
      </div>
    </div>
  );
}
```
*Note: The `StatCard` component needs to accept an `icon` prop of type `React.ReactNode`.*

- [ ] **Step 3: Create `LatestPosts.tsx`**
This component will display the 3 most recent posts.

```tsx
// src/components/modules/home/LatestPosts.tsx
import Link from 'next/link';

interface Post {
  title: string;
  slug: string;
  created_at: string;
  categories: { name: string } | null;
}

interface LatestPostsProps {
  posts: Post[];
}

export default function LatestPosts({ posts }: LatestPostsProps) {
  return (
    <div className="py-12 max-w-7xl mx-auto px-4">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold">Informasi Terkini</h2>
        <Link href="/posts" className="font-semibold text-blue-600 hover:underline">
          Lihat Semua Berita &rarr;
        </Link>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {posts.map((post) => (
          <Link key={post.slug} href={`/posts/${post.slug}`} className="block bg-white dark:bg-slate-800 rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-shadow border border-slate-200 dark:border-slate-700">
            {/* Placeholder for image */}
            <div className="h-40 bg-slate-200 dark:bg-slate-700"></div>
            <div className="p-6">
              <p className="text-sm font-semibold text-blue-600">{post.categories?.name || 'Umum'}</p>
              <h3 className="mt-2 text-xl font-bold">{post.title}</h3>
              <p className="mt-4 text-sm text-slate-500">{new Date(post.created_at).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Create `VillageApparatus.tsx`**
This component will showcase key village staff members.

```tsx
// src/components/modules/home/VillageApparatus.tsx
import Link from 'next/link';
import Image from 'next/image';

interface Staff {
  name: string;
  position: string;
  photo_url: string | null;
}

interface VillageApparatusProps {
  staff: Staff[];
}

export default function VillageApparatus({ staff }: VillageApparatusProps) {
  return (
    <div className="py-12 bg-slate-50 dark:bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold">Kenali Perangkat Desa Anda</h2>
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {staff.map((member) => (
            <div key={member.name} className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-md border border-slate-200 dark:border-slate-700">
              <div className="relative w-32 h-32 mx-auto rounded-full overflow-hidden bg-slate-200 dark:bg-slate-700">
                {member.photo_url ? (
                  <Image src={member.photo_url} alt={member.name} layout="fill" objectFit="cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-400">
                    <svg className="w-16 h-16" fill="currentColor" viewBox="0 0 24 24"><path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                  </div>
                )}
              </div>
              <h3 className="mt-4 text-xl font-bold">{member.name}</h3>
              <p className="mt-1 text-blue-600 font-semibold">{member.position}</p>
            </div>
          ))}
        </div>
        <div className="mt-12">
          <Link href="/tentang" className="px-8 py-3 border border-slate-300 dark:border-slate-600 rounded-xl font-bold hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
            Lihat Struktur Lengkap
          </Link>
        </div>
      </div>
    </div>
  );
}
```

### Task 3: Assemble the Homepage
Finally, we will update the main `page.tsx` to fetch the data and render the new components.

**Files:**
- Modify: `src/app/page.tsx`
- Create: `public/placeholder-bg.jpg` (a placeholder image)

- [ ] **Step 1: Create a placeholder background image.**
Create a simple placeholder image at `public/placeholder-bg.jpg`. This can be a plain dark rectangle or any freely available landscape photo.

- [ ] **Step 2: Update `src/app/page.tsx`**

```tsx
// src/app/page.tsx
import { getHomepageData } from '@/services/data-service';
import HeroSection from '@/components/modules/home/HeroSection';
import StatGrid from '@/components/modules/home/StatGrid';
import LatestPosts from '@/components/modules/home/LatestPosts';
import VillageApparatus from '@/components/modules/home/VillageApparatus';

export default async function HomePage() {
  const data = await getHomepageData();

  return (
    <main>
      <HeroSection villageName={data.villageName} />
      <StatGrid 
        population={data.population}
        budget={data.budget}
        hamletCount={data.hamletCount}
        staffCount={data.staffCount}
      />
      <LatestPosts posts={data.posts} />
      <VillageApparatus staff={data.staff} />
    </main>
  );
}
```
