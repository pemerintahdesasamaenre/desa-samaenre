'use client';

import { Globe, HelpCircle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import ImageUpload from '@/components/ui/ImageUpload';

interface IdentityContactSectionProps {
  initialData: {
    name: string;
    contact_info?: {
      email?: string | null;
      phone?: string | null;
      address?: string | null;
      maps_url?: string | null;
    } | null;
  };
  logoUrl: string;
  setLogoUrl: (url: string) => void;
  bannerUrl: string;
  setBannerUrl: (url: string) => void;
  mapsUrl: string;
  setMapsUrl: (url: string) => void;
  phoneNumber: string;
  setPhoneNumber: (num: string) => void;
}

export default function IdentityContactSection({
  initialData,
  logoUrl,
  setLogoUrl,
  bannerUrl,
  setBannerUrl,
  mapsUrl,
  setMapsUrl,
  phoneNumber,
  setPhoneNumber
}: IdentityContactSectionProps) {
  
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    let cleaned = val.replace(/\D/g, '');
    if (val.startsWith('+62')) cleaned = '62' + cleaned.substring(2);
    setPhoneNumber(cleaned);
  };

  const handleMapsInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const trimmedInput = e.target.value.trim();
    if (!trimmedInput) { 
      setMapsUrl(''); 
      return; 
    }
    if (trimmedInput.includes('<iframe')) {
      const srcMatch = trimmedInput.match(/src="([^"]+)"/);
      if (srcMatch && srcMatch[1]) {
        setMapsUrl(srcMatch[1]);
        return;
      }
    }
    setMapsUrl(trimmedInput);
  };

  return (
    <section className="space-y-6 sm:space-y-10">
      <div className="border-b border-border pb-4 sm:pb-6 flex items-center gap-3">
         <div className="p-1.5 sm:p-2 bg-primary/10 text-primary rounded-lg sm:rounded-xl">
           <Globe size={20} />
         </div>
         <h2 className="text-sm sm:text-xl font-bold uppercase tracking-tight text-foreground">Identitas & Kontak</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-10">
        <div className="space-y-6 sm:space-y-8">
          <div className="space-y-2">
            <Label>Nama Resmi Desa</Label>
            <Input name="name" defaultValue={initialData.name || ''} required className="h-11 sm:h-12 text-sm" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            <div className="space-y-2">
              <Label>Email</Label>
              <Input name="email" type="email" defaultValue={initialData.contact_info?.email || ''} className="h-11 sm:h-12 text-sm" />
            </div>
            <div className="space-y-2">
              <Label>Nomor Telepon</Label>
              <Input type="text" value={phoneNumber} onChange={handlePhoneChange} className="h-11 sm:h-12 text-sm" />
            </div>
          </div>
          <div className="space-y-2">
            <Label className="flex items-center gap-2">Google Maps <HelpCircle size={12} /></Label>
            <Input value={mapsUrl} onChange={handleMapsInputChange} placeholder="Link Iframe Maps" className="h-11 sm:h-12 text-sm" />
          </div>
          <div className="space-y-2">
            <Label>Alamat Kantor</Label>
            <textarea 
              name="address" 
              rows={3}
              defaultValue={initialData.contact_info?.address || ''} 
              className="w-full p-4 rounded-xl sm:rounded-[2rem] border border-border bg-background text-sm font-medium resize-none outline-none focus:ring-4 focus:ring-primary/10 transition-all" 
            />
          </div>
        </div>
        <div className="space-y-6 sm:space-y-8">
          <ImageUpload label="Logo Desa" folder="branding" value={logoUrl} onChange={setLogoUrl} />
          <ImageUpload label="Banner Header" folder="branding" value={bannerUrl} onChange={setBannerUrl} />
        </div>
      </div>
    </section>
  );
}