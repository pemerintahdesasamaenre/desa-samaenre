'use client'

import { useState, useEffect } from 'react'
import { MessageCircle, X, Send, User, CreditCard, ClipboardList, HelpCircle, Edit3 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import CustomSelect from '@/components/ui/CustomSelect'

const SERVICES = [
  { id: 'sktm', name: 'Surat Keterangan Tidak Mampu (SKTM)' },
  { id: 'domisili', name: 'Surat Keterangan Domisili' },
  { id: 'ktp_kk', name: 'Pengantar KTP / KK' },
  { id: 'sku', name: 'Surat Keterangan Usaha (SKU)' },
  { id: 'pengaduan', name: 'Layanan Pengaduan / Aspirasi' },
  { id: 'lainnya', name: 'Lainnya (Ketik Manual)' },
]

export default function ServiceFloater() {
  const [isOpen, setIsOpen] = useState(false)
  const [villageInfo, setVillageInfo] = useState<{name: string, contact_info: {phone: string}} | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    nik: '',
    service: '',
    manualService: '',
    notes: ''
  })

  useEffect(() => {
    const fetchVillageInfo = async () => {
      const supabase = createClient()
      const { data } = await supabase.from('village_info').select('name, contact_info').single()
      if (data) setVillageInfo(data as any)
    }
    fetchVillageInfo()
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    let phoneNumber = villageInfo?.contact_info?.phone || ''
    phoneNumber = phoneNumber.replace(/[^0-9]/g, '')
    if (phoneNumber.startsWith('0')) {
      phoneNumber = '62' + phoneNumber.slice(1)
    } else if (!phoneNumber.startsWith('62')) {
      phoneNumber = '62' + phoneNumber
    }

    const selectedServiceName = formData.service === 'lainnya' 
      ? formData.manualService 
      : SERVICES.find(s => s.id === formData.service)?.name || formData.service
    
    const message = `Halo Pemerintah Desa ${villageInfo?.name || ''},

Perkenalkan, saya:
*Nama:* ${formData.name}
*NIK:* ${formData.nik}

Saya ingin mengajukan permohonan layanan:
*Jenis Layanan:* ${selectedServiceName}

*Keperluan / Catatan Tambahan:*
${formData.notes}

Terima kasih.`

    const waUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`
    window.open(waUrl, '_blank')
    setIsOpen(false)
    setFormData({ name: '', nik: '', service: '', manualService: '', notes: '' })
  }

  return (
    <div className="fixed bottom-6 right-6 z-[9999] font-sans">
      {/* Tooltip */}
      {!isOpen && (
        <div className="absolute right-full mr-4 bottom-2 hidden md:block animate-in fade-in slide-in-from-right-4">
          <div className="bg-card border border-border p-3 rounded-2xl shadow-xl whitespace-nowrap">
            <p className="text-xs font-bold text-foreground tracking-tight font-sans">Butuh bantuan administrasi?</p>
            <p className="text-[10px] text-muted-foreground font-medium">Klik untuk layanan pengajuan via WA</p>
          </div>
        </div>
      )}

      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-label={isOpen ? "Tutup layanan mandiri" : "Buka layanan mandiri"}
        aria-expanded={isOpen}
        className={`
          relative w-16 h-16 rounded-full flex items-center justify-center transition-all duration-500 shadow-2xl group
          ${isOpen ? 'bg-destructive rotate-90 scale-90' : 'bg-primary hover:scale-110'}
        `}
      >
        {isOpen ? (
          <X className="text-destructive-foreground" size={32} />
        ) : (
          <div className="relative">
            <MessageCircle className="text-primary-foreground fill-current/10" size={32} />
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-destructive border-2 border-primary rounded-full animate-ping"></span>
          </div>
        )}
      </button>

      {/* Service Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-[10000] flex items-end sm:items-center justify-center sm:justify-end sm:p-10 p-0">
          {/* Backdrop Overlay */}
          <div 
            className="absolute inset-0 bg-background/40 sm:backdrop-blur-md animate-in fade-in duration-200"
            onClick={() => setIsOpen(false)}
          />

          <div className="relative w-full sm:w-[420px] max-h-[92vh] sm:max-h-[85vh] bg-card rounded-t-[2.5rem] sm:rounded-[3rem] shadow-2xl border-t sm:border border-border overflow-hidden animate-in slide-in-from-bottom-full transition-all duration-300">
            {/* Handle for Mobile Bottom Sheet */}
            <div className="flex justify-center pt-3 sm:hidden">
              <div className="w-10 h-1 bg-muted-foreground/20 rounded-full" />
            </div>

            {/* Header - More compact on mobile */}
            <div className="bg-primary p-4 sm:p-8 text-primary-foreground relative mt-1 sm:mt-0">
              <div className="absolute top-0 right-0 p-8 opacity-10 hidden sm:block">
                <MessageCircle size={100} />
              </div>
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg sm:text-2xl font-black leading-tight tracking-tighter uppercase italic">Layanan Mandiri</h3>
                  <p className="text-primary-foreground/80 text-[9px] sm:text-[10px] font-bold uppercase tracking-widest mt-1 border-l-2 border-primary-foreground/30 pl-2">Desa {villageInfo?.name}</p>
                </div>
                <button 
                  onClick={() => setIsOpen(false)}
                  aria-label="Tutup modal"
                  className="p-2 hover:bg-white/10 rounded-full transition-colors sm:hidden"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Form Content - Compact spacing on mobile */}
            <div className="p-5 sm:p-8 overflow-y-auto max-h-[calc(92vh-100px)] sm:max-h-[calc(85vh-160px)] custom-scrollbar">
              <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-6 text-foreground">
                <div className="space-y-1">
                  <label className="text-[9px] sm:text-[10px] font-black text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                    <User size={10} className="text-primary" /> Identitas Pengaju
                  </label>
                  <input
                    required
                    type="text"
                    placeholder="Nama Lengkap"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full bg-muted/30 border-none rounded-xl px-4 py-2.5 sm:py-3.5 text-xs sm:text-sm font-bold text-foreground focus:ring-2 focus:ring-primary transition-all outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] sm:text-[10px] font-black text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                    <CreditCard size={10} className="text-primary" /> NIK Warga
                  </label>
                  <input
                    required
                    type="text"
                    inputMode="numeric"
                    maxLength={16}
                    placeholder="16 Digit NIK"
                    value={formData.nik}
                    onChange={(e) => setFormData({...formData, nik: e.target.value.replace(/\D/g, '')})}
                    className="w-full bg-muted/30 border-none rounded-xl px-4 py-2.5 sm:py-3.5 text-xs sm:text-sm font-bold text-foreground focus:ring-2 focus:ring-primary transition-all outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <CustomSelect
                    label="Jenis Layanan"
                    options={SERVICES.map(s => ({ id: s.id, name: s.name }))}
                    value={formData.service}
                    onChange={(val) => setFormData({...formData, service: val})}
                    icon={ClipboardList}
                    placeholder="Pilih layanan..."
                    required
                  />
                </div>

                {formData.service === 'lainnya' && (
                  <div className="space-y-1 animate-in slide-in-from-top-2 duration-300">
                    <label className="text-[9px] font-black text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                      <Edit3 size={10} className="text-primary" /> Nama Layanan
                    </label>
                    <input
                      required
                      type="text"
                      placeholder="Jenis layanan"
                      value={formData.manualService}
                      onChange={(e) => setFormData({...formData, manualService: e.target.value})}
                      className="w-full bg-primary/5 border-2 border-primary/20 rounded-xl px-4 py-2.5 text-xs sm:text-sm font-bold text-foreground focus:ring-2 focus:ring-primary transition-all outline-none"
                    />
                  </div>
                )}

                <div className="space-y-1">
                  <label className="text-[9px] sm:text-[10px] font-black text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                    <HelpCircle size={10} className="text-primary" /> Detail Keperluan
                  </label>
                  <textarea
                    required
                    placeholder="Tuliskan detail..."
                    value={formData.notes}
                    onChange={(e) => setFormData({...formData, notes: e.target.value})}
                    rows={2}
                    className="w-full bg-muted/30 border-none rounded-xl px-4 py-2.5 text-xs sm:text-sm font-bold text-foreground focus:ring-2 focus:ring-primary transition-all outline-none resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-primary hover:opacity-90 text-primary-foreground py-3.5 sm:py-5 rounded-[1.2rem] sm:rounded-[1.8rem] font-black text-xs sm:text-sm tracking-tighter flex items-center justify-center gap-3 shadow-xl shadow-primary/20 transition-all active:scale-95 mt-2"
                >
                  KIRIM KE WHATSAPP
                  <Send size={18} />
                </button>
                
                <p className="text-[8px] sm:text-[9px] text-center text-muted-foreground font-bold uppercase tracking-tight leading-relaxed">
                  *Diproses manual oleh petugas desa.
                </p>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
