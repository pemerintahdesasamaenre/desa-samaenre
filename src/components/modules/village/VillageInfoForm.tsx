'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { updateVillageInfo } from '@/actions/village-info';
import { Save, Loader2 } from 'lucide-react';
import { type VillageInfoInput } from '@/lib/validations';
import { toast } from 'sonner';

// Form Sections
import IdentityContactSection from './form-sections/IdentityContactSection';
import GeographySection from './form-sections/GeographySection';
import VisionMissionSection from './form-sections/VisionMissionSection';
import HistoryLeadershipSection from './form-sections/HistoryLeadershipSection';

interface FormerLeader {
  name: string;
  period: string;
}

interface MissionSection {
  title: string;
  items: string[];
}

interface VillageInfoFormProps {
  initialData: {
    id: number;
    name: string;
    vision?: string | null;
    mission?: MissionSection[] | string[] | null;
    former_leaders?: FormerLeader[] | null;
    history?: string | null;
    logo_url?: string | null;
    header_banner_url?: string | null;
    area_size?: string | null;
    boundaries?: {
      north?: string | null;
      south?: string | null;
      east?: string | null;
      west?: string | null;
    } | null;
    contact_info?: {
      email?: string | null;
      phone?: string | null;
      address?: string | null;
      maps_url?: string | null;
    } | null;
  };
}

function parseMissions(raw: MissionSection[] | string[] | null | undefined): MissionSection[] {
  if (!Array.isArray(raw) || raw.length === 0) return [];
  if (typeof raw[0] === 'string') {
    return (raw as string[]).map(s => ({ title: s, items: [] }));
  }
  return raw as MissionSection[];
}

export default function VillageInfoForm({ initialData }: VillageInfoFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // State for components that need it
  const [logoUrl, setLogoUrl] = useState(initialData.logo_url || '');
  const [bannerUrl, setBannerUrl] = useState(initialData.header_banner_url || '');
  const [mapsUrl, setMapsUrl] = useState(initialData.contact_info?.maps_url || '');
  const [phoneNumber, setPhoneNumber] = useState(initialData.contact_info?.phone || '');
  const [missionSections, setMissionSections] = useState<MissionSection[]>(parseMissions(initialData.mission));
  const [formerLeaders, setFormerLeaders] = useState<FormerLeader[]>(Array.isArray(initialData.former_leaders) ? initialData.former_leaders : []);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(event.currentTarget);
    const data: VillageInfoInput = {
      name: formData.get('name') as string,
      vision: formData.get('vision') as string,
      mission: missionSections.filter(s => s.title.trim() !== '').map(s => ({
        title: s.title,
        items: s.items.filter(item => item.trim() !== ''),
      })),
      former_leaders: formerLeaders.filter(l => l.name.trim() !== '' && l.period.trim() !== ''),
      history: formData.get('history') as string,
      logo_url: logoUrl,
      header_banner_url: bannerUrl,
      area_size: formData.get('area_size') as string,
      boundaries: {
        north: formData.get('boundary_north') as string,
        south: formData.get('boundary_south') as string,
        east: formData.get('boundary_east') as string,
        west: formData.get('boundary_west') as string,
      },
      contact_info: {
        email: formData.get('email') as string,
        phone: phoneNumber, 
        address: formData.get('address') as string,
        maps_url: mapsUrl, 
      }
    };

    const toastId = toast.loading('Memperbarui informasi desa...');
    try {
      const result = await updateVillageInfo(initialData.id, data);
      if (result.error) {
        const errorMessages = typeof result.error === 'string' 
          ? result.error 
          : Object.values(result.error).flat().join(', ');
        setError(errorMessages || 'Gagal memvalidasi data.');
        toast.error('Gagal memperbarui informasi desa.', { id: toastId });
      } else {
        toast.success('Informasi desa berhasil diperbarui!', { id: toastId });
        router.refresh();
      }
    } catch {
      setError('Kesalahan koneksi.');
      toast.error('Kesalahan koneksi ke server', { id: toastId });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-card rounded-2xl sm:rounded-[3rem] shadow-sm border border-border overflow-hidden">
      <form onSubmit={handleSubmit} className="p-5 sm:p-10 space-y-8 sm:space-y-12">
        {error && (
          <div className="p-3 sm:p-4 bg-destructive/10 border border-destructive/20 text-destructive rounded-xl text-xs sm:text-sm font-bold animate-in fade-in slide-in-from-top-2">
            {error}
          </div>
        )}

        <IdentityContactSection 
          initialData={initialData}
          logoUrl={logoUrl}
          setLogoUrl={setLogoUrl}
          bannerUrl={bannerUrl}
          setBannerUrl={setBannerUrl}
          mapsUrl={mapsUrl}
          setMapsUrl={setMapsUrl}
          phoneNumber={phoneNumber}
          setPhoneNumber={setPhoneNumber}
        />

        <GeographySection initialData={initialData} />

        <VisionMissionSection 
          initialVision={initialData.vision}
          missionSections={missionSections}
          setMissionSections={setMissionSections}
        />

        <HistoryLeadershipSection 
          initialHistory={initialData.history}
          formerLeaders={formerLeaders}
          setFormerLeaders={setFormerLeaders}
        />

        <div className="pt-6 sm:pt-10 border-t border-border flex justify-end">
          <button 
            type="submit" 
            disabled={loading} 
            className="w-full sm:w-auto bg-primary text-primary-foreground px-10 py-4 rounded-full font-bold flex items-center justify-center gap-3 hover:opacity-90 disabled:opacity-50 transition-all shadow-lg text-[10px] sm:text-sm tracking-widest uppercase active:scale-95"
          >
            {loading ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
            Simpan Seluruh Perubahan
          </button>
        </div>
      </form>
    </div>
  );
}