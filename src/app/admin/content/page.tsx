import { getVillageInfo } from '@/services/data-service';
import VillageInfoForm from '@/components/modules/village/VillageInfoForm';

export default async function AdminContentPage() {
  const villageInfo = await getVillageInfo();

  return (
    <div className="space-y-10">
      <div className="bg-card p-8 rounded-[2.5rem] border border-border shadow-sm">
        <h1 className="text-4xl font-black text-foreground tracking-tighter">Konten Desa</h1>
        <p className="text-muted-foreground mt-2 font-medium">Perbarui profil umum, visi, misi, dan sejarah desa Anda.</p>
      </div>

      <VillageInfoForm initialData={villageInfo} />
    </div>
  );
}
