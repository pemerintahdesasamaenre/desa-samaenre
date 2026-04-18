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
