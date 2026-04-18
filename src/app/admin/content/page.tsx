import { getVillageInfo } from '@/services/data-service';
import VillageInfoForm from '@/components/modules/village/VillageInfoForm';

export default async function AdminContentPage() {
  const villageInfo = await getVillageInfo();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Kelola Konten Desa</h1>
        <p className="text-slate-500 mt-2">Perbarui profil umum, visi, misi, dan sejarah desa Anda.</p>
      </div>

      <VillageInfoForm initialData={villageInfo} />
    </div>
  );
}
