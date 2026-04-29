"use client";
import React, { useState, useEffect } from "react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { cn } from "@/lib/utils";
import { MessageCircle, X, ClipboardList } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import CustomSelect from '@/components/ui/CustomSelect';

const SERVICES = [
  { id: 'sktm', name: 'Surat Keterangan Tidak Mampu (SKTM)' },
  { id: 'domisili', name: 'Surat Keterangan Domisili' },
  { id: 'ktp_kk', name: 'Pengantar KTP / KK' },
  { id: 'sku', name: 'Surat Keterangan Usaha (SKU)' },
  { id: 'pengaduan', name: 'Layanan Pengaduan / Aspirasi' },
  { id: 'lainnya', name: 'Lainnya (Ketik Manual)' },
];

export default function ServiceFloater() {
  const [isOpen, setIsOpen] = useState(false);
  const [villageInfo, setVillageInfo] = useState<{name: string, contact_info: {phone: string}} | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    nik: '',
    service: '',
    manualService: '',
    notes: ''
  });

  useEffect(() => {
    const fetchVillageInfo = async () => {
      const supabase = createClient();
      const { data } = await supabase.from('village_info').select('name, contact_info').single();
      if (data) setVillageInfo(data as { name: string; contact_info: { phone: string } });
    };
    fetchVillageInfo();
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    let phoneNumber = villageInfo?.contact_info?.phone || '';
    phoneNumber = phoneNumber.replace(/[^0-9]/g, '');
    if (phoneNumber.startsWith('0')) {
      phoneNumber = '62' + phoneNumber.slice(1);
    } else if (!phoneNumber.startsWith('62')) {
      phoneNumber = '62' + phoneNumber;
    }

    const selectedServiceName = formData.service === 'lainnya' 
      ? formData.manualService 
      : SERVICES.find(s => s.id === formData.service)?.name || formData.service;
    
    const message = `Halo Pemerintah Desa ${villageInfo?.name || ''},

Perkenalkan, saya:
*Nama:* ${formData.name}
*NIK:* ${formData.nik}

Saya ingin mengajukan permohonan layanan:
*Jenis Layanan:* ${selectedServiceName}

*Keperluan / Catatan Tambahan:*
${formData.notes}

Terima kasih.`;

    const waUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(waUrl, '_blank');
    setIsOpen(false);
    setFormData({ name: '', nik: '', service: '', manualService: '', notes: '' });
  };

  return (
    <div className="fixed bottom-6 right-6 z-[9999] font-sans">
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-label={isOpen ? "Tutup layanan mandiri" : "Buka layanan mandiri"}
        className={cn(
          "relative w-16 h-16 rounded-full flex items-center justify-center transition-all duration-500 shadow-2xl group",
          isOpen ? 'bg-destructive rotate-90 scale-90' : 'bg-primary hover:scale-110'
        )}
      >
        {isOpen ? <X className="text-destructive-foreground" size={32} /> : <MessageCircle className="text-primary-foreground" size={32} />}
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 sm:p-6">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={() => setIsOpen(false)} />
          
          <div className="shadow-input relative w-full sm:w-[500px] max-h-[90vh] overflow-y-auto bg-card p-8 sm:p-10 rounded-[2.5rem] z-10 border border-border animate-in zoom-in-95 duration-300">
            <div className="flex justify-between items-start mb-2">
              <h2 className="text-3xl font-bold text-foreground uppercase tracking-tighter italic">
                Layanan Mandiri
              </h2>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-muted rounded-full transition-colors"
              >
                <X size={24} />
              </button>
            </div>
            <p className="text-sm text-muted-foreground font-medium">
              Ajukan permohonan surat atau pengaduan langsung ke WhatsApp Sekretariat Desa {villageInfo?.name}.
            </p>

            <form className="mt-8 space-y-4 pb-4" onSubmit={handleSubmit}>
              <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
                <LabelInputContainer>
                  <Label htmlFor="name">Nama Lengkap</Label>
                  <Input 
                    id="name" 
                    placeholder="Contoh: Budi Santoso" 
                    type="text" 
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                  />
                </LabelInputContainer>
                <LabelInputContainer>
                  <Label htmlFor="nik">NIK (16 Digit)</Label>
                  <Input 
                    id="nik" 
                    placeholder="73xxxxxxxxxxxxxx" 
                    type="text" 
                    maxLength={16}
                    required
                    value={formData.nik}
                    onChange={(e) => setFormData({...formData, nik: e.target.value.replace(/\D/g, '')})}
                  />
                </LabelInputContainer>
              </div>

              <LabelInputContainer>
                <CustomSelect
                  label="Jenis Layanan"
                  options={SERVICES.map(s => ({ id: s.id, name: s.name }))}
                  value={formData.service}
                  onChange={(val) => setFormData({...formData, service: val})}
                  icon={ClipboardList}
                  placeholder="Pilih layanan..."
                  required
                />
              </LabelInputContainer>

              {formData.service === 'lainnya' && (
                <LabelInputContainer className="animate-in slide-in-from-top-2">
                  <Label htmlFor="manualService">Nama Layanan</Label>
                  <Input 
                    id="manualService" 
                    placeholder="Sebutkan layanan lainnya" 
                    type="text" 
                    required
                    value={formData.manualService}
                    onChange={(e) => setFormData({...formData, manualService: e.target.value})}
                  />
                </LabelInputContainer>
              )}

              <LabelInputContainer>
                <Label htmlFor="notes">Detail Keperluan</Label>
                <textarea
                  id="notes"
                  placeholder="Tuliskan alasan atau rincian permohonan..."
                  className="flex w-full border border-border bg-background text-foreground shadow-sm rounded-md px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-[2px] focus-visible:ring-primary transition duration-400 min-h-[80px] resize-none"
                  required
                  value={formData.notes}
                  onChange={(e) => setFormData({...formData, notes: e.target.value})}
                />
              </LabelInputContainer>

              <button
                className="group/btn relative block h-12 w-full rounded-xl bg-primary hover:bg-primary/90 font-bold text-primary-foreground shadow-xl shadow-primary/20 uppercase tracking-widest text-xs mt-6 transition-all active:scale-[0.98]"
                type="submit"
              >
                Kirim ke WhatsApp &rarr;
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

const LabelInputContainer = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className={cn("flex w-full flex-col space-y-2", className)}>
      {children}
    </div>
  );
};
