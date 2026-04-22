'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { upsertResident, deleteResident } from '@/actions/residents';
import { Save, Loader2, ArrowLeft, User, Contact, MapPin, Calendar, Briefcase, Users, Eye, EyeOff, Trash2 } from 'lucide-react';
import Link from 'next/link';
import CustomSelect from '@/components/ui/CustomSelect';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Resident } from '@/types';

interface ResidentFormProps {
  initialData?: Resident;
  isEditing?: boolean;
}

const GENDER_OPTIONS = [
  { id: 'L', name: 'Laki-laki' },
  { id: 'P', name: 'Perempuan' }
];

export default function ResidentForm({ initialData, isEditing }: ResidentFormProps) {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const [loading, setLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // State untuk visibilitas input
  const [showNik, setShowNik] = useState(false);
  const [showKk, setShowKk] = useState(false);
  
  // State untuk modal konfirmasi
  const [showSaveConfirm, setShowSaveConfirm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const TARGET_SAVE_PHRASE = "SAYA BERTANGGUNG JAWAB ATAS PERUBAHAN DATA INI";

  const handleOpenSaveConfirm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formRef.current?.checkValidity()) {
      formRef.current?.reportValidity();
      return;
    }
    setShowSaveConfirm(true);
  };

  async function handleSave() {
    setLoading(true);
    setError(null);
    setShowSaveConfirm(false);

    const formData = new FormData(formRef.current!);
    const data = {
      nik: formData.get('nik') as string,
      kk: formData.get('kk') as string,
      name: formData.get('name') as string,
      birth_place: formData.get('birth_place') as string || '',
      birth_date: formData.get('birth_date') as string || null,
      gender: formData.get('gender') as 'L' | 'P',
      education: formData.get('education') as string,
      occupation: formData.get('occupation') as string,
      marital_status: formData.get('marital_status') as string,
      father_name: formData.get('father_name') as string || '',
      mother_name: formData.get('mother_name') as string || '',
      dusun: formData.get('dusun') as string || '',
      rt: formData.get('rt') as string || '',
      rw: formData.get('rw') as string || '',
      data_year: parseInt(formData.get('data_year') as string, 10) || new Date().getFullYear(),
    };

    try {
      const result = await upsertResident(data, isEditing ? initialData?.id : undefined);

      if (result.error) {
        setError(result.error as string);
      } else {
        router.push('/admin/residents');
        router.refresh();
      }
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Gagal menyimpan data penduduk.');
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete() {
    if (!initialData?.id) return;
    
    setIsDeleting(true);
    setShowDeleteConfirm(false);
    
    try {
      const result = await deleteResident(initialData.id);
      if (result.success) {
        router.push('/admin/residents');
        router.refresh();
      } else {
        alert('Gagal menghapus: ' + result.error);
      }
    } catch {
      alert('Terjadi kesalahan sistem saat menghapus.');
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <div className="max-w-4xl mx-auto pb-20 px-4 sm:px-0">
      <div className="mb-6 flex items-center justify-between">
        <Link 
          href="/admin/residents" 
          className="text-muted-foreground hover:text-primary flex items-center gap-2 transition-colors font-bold uppercase text-[10px] tracking-widest"
        >
          <ArrowLeft size={18} />
          Kembali ke Daftar
        </Link>

        {isEditing && (
          <button
            type="button"
            onClick={() => setShowDeleteConfirm(true)}
            className="flex items-center gap-2 text-destructive hover:bg-destructive/10 font-black text-[10px] uppercase tracking-widest bg-destructive/5 px-6 py-3 rounded-full transition-all border border-destructive/20 shadow-sm"
          >
            <Trash2 size={16} />
            Hapus Record
          </button>
        )}
      </div>

      <div className="bg-card rounded-[3rem] border border-border shadow-sm overflow-hidden">
        <div className="p-10 border-b border-border bg-muted/30">
          <h2 className="text-3xl font-black text-foreground tracking-tighter">
            {isEditing ? 'Edit Data Penduduk' : 'Tambah Penduduk Baru'}
          </h2>
          <p className="text-muted-foreground mt-2 font-medium">
            Setiap perubahan data kependudukan resmi akan dicatat secara otomatis dalam sistem audit log.
          </p>
        </div>

        <form ref={formRef} onSubmit={handleOpenSaveConfirm} className="p-10 space-y-10">
          {typeof error === 'string' && (
            <div className="p-4 bg-destructive/10 border border-destructive/20 text-destructive rounded-2xl text-sm font-bold">
              {error}
            </div>
          )}

          {/* Section 1: Identitas Utama */}
          <div className="space-y-8">
            <h3 className="text-xs font-black uppercase tracking-[0.3em] text-primary flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Contact size={18} />
              </div>
              Identitas Utama
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <Label>NIK (16 Digit)</Label>
                <div className="relative">
                  <Input 
                    name="nik" 
                    type={showNik ? "text" : "password"}
                    defaultValue={initialData?.nik}
                    placeholder="16 digit NIK"
                    required
                    maxLength={16}
                    className="font-mono tracking-[0.2em]"
                  />
                  <button 
                    type="button"
                    onClick={() => setShowNik(!showNik)}
                    className="absolute right-5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors"
                  >
                    {showNik ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <Label>No. Kartu Keluarga (16 Digit)</Label>
                <div className="relative">
                  <Input 
                    name="kk" 
                    type={showKk ? "text" : "password"}
                    defaultValue={initialData?.kk}
                    placeholder="16 digit Nomor KK"
                    required
                    maxLength={16}
                    className="font-mono tracking-[0.2em]"
                  />
                  <button 
                    type="button"
                    onClick={() => setShowKk(!showKk)}
                    className="absolute right-5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors"
                  >
                    {showKk ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label>Nama Lengkap Sesuai KTP</Label>
                <Input 
                  name="name" 
                  defaultValue={initialData?.name}
                  placeholder="NAMA LENGKAP"
                  required
                  className="uppercase font-black tracking-tight"
                />
              </div>
            </div>
          </div>

          <div className="space-y-8 pt-6 border-t border-border">
            <h3 className="text-xs font-black uppercase tracking-[0.3em] text-primary flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Calendar size={18} />
              </div>
              Kelahiran & Gender
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="space-y-2">
                <Label>Tempat Lahir</Label>
                <Input 
                  name="birth_place" 
                  defaultValue={initialData?.birth_place}
                  placeholder="KABUPATEN / KOTA"
                  className="uppercase"
                />
              </div>

              <div className="space-y-2">
                <Label>Tanggal Lahir</Label>
                <Input 
                  name="birth_date" 
                  type="date"
                  defaultValue={initialData?.birth_date}
                  required
                />
              </div>

              <div className="space-y-2">
                <CustomSelect 
                  label="Jenis Kelamin"
                  name="gender"
                  options={GENDER_OPTIONS}
                  defaultValue={initialData?.gender || 'L'}
                  icon={User}
                  required
                />
              </div>
            </div>
          </div>

          <div className="space-y-8 pt-6 border-t border-border">
            <h3 className="text-xs font-black uppercase tracking-[0.3em] text-primary flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <MapPin size={18} />
              </div>
              Alamat Domisili
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="space-y-2">
                <Label>Dusun / Lingkungan</Label>
                <Input 
                  name="dusun" 
                  defaultValue={initialData?.dusun}
                  placeholder="NAMA DUSUN"
                  className="uppercase"
                />
              </div>

              <div className="space-y-2">
                <Label>RT</Label>
                <Input 
                  name="rt" 
                  defaultValue={initialData?.rt}
                  placeholder="000"
                  className="font-mono"
                />
              </div>

              <div className="space-y-2">
                <Label>RW</Label>
                <Input 
                  name="rw" 
                  defaultValue={initialData?.rw}
                  placeholder="000"
                  className="font-mono"
                />
              </div>
            </div>
          </div>

          <div className="space-y-8 pt-6 border-t border-border">
            <h3 className="text-xs font-black uppercase tracking-[0.3em] text-primary flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Briefcase size={18} />
              </div>
              Sosial & Ekonomi
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <Label>Pendidikan Terakhir</Label>
                <Input 
                  name="education" 
                  defaultValue={initialData?.education}
                  placeholder="CONTOH: SMA / SEDERAJAT"
                  required
                  className="uppercase"
                />
              </div>

              <div className="space-y-2">
                <Label>Pekerjaan Utama</Label>
                <Input 
                  name="occupation" 
                  defaultValue={initialData?.occupation}
                  placeholder="CONTOH: PETANI / PEKEBUN"
                  required
                  className="uppercase"
                />
              </div>

              <div className="space-y-2">
                <Label>Status Perkawinan</Label>
                <Input 
                  name="marital_status" 
                  defaultValue={initialData?.marital_status}
                  placeholder="CONTOH: KAWIN"
                  required
                  className="uppercase"
                />
              </div>

              <div className="space-y-2">
                <Label>Tahun Pendataan</Label>
                <Input 
                  name="data_year" 
                  type="number"
                  defaultValue={initialData?.data_year || new Date().getFullYear()}
                  required
                  className="font-mono"
                />
              </div>
            </div>
          </div>

          <div className="space-y-8 pt-6 border-t border-border">
            <h3 className="text-xs font-black uppercase tracking-[0.3em] text-primary flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Users size={18} />
              </div>
              Data Orang Tua
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <Label>Nama Ayah Kandung</Label>
                <Input 
                  name="father_name" 
                  defaultValue={initialData?.father_name}
                  placeholder="NAMA AYAH"
                  className="uppercase"
                />
              </div>

              <div className="space-y-2">
                <Label>Nama Ibu Kandung</Label>
                <Input 
                  name="mother_name" 
                  defaultValue={initialData?.mother_name}
                  placeholder="NAMA IBU"
                  className="uppercase"
                />
              </div>
            </div>
          </div>

          <div className="pt-10 border-t border-border flex justify-end">
            <button 
              type="submit" 
              disabled={loading}
              className="bg-primary text-primary-foreground px-12 py-5 rounded-full font-black flex items-center gap-4 hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-2xl shadow-primary/30 active:scale-95 text-sm tracking-widest uppercase"
            >
              {loading ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
              {isEditing ? 'Simpan Perubahan' : 'Tambah Penduduk'}
            </button>
          </div>
        </form>
      </div>

      <ConfirmDialog 
        isOpen={showSaveConfirm}
        onClose={() => setShowSaveConfirm(false)}
        onConfirm={handleSave}
        title="Konfirmasi Integritas Data"
        description="Anda sedang mencoba mengubah data kependudukan resmi. Kesalahan penginputan data dapat berakibat pada validitas statistik desa."
        requirePhrase={TARGET_SAVE_PHRASE}
        confirmLabel="Saya Yakin & Simpan"
        loading={loading}
      />

      <ConfirmDialog 
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleDelete}
        title="Hapus Record Penduduk"
        description={`Apakah Anda benar-benar yakin ingin menghapus data penduduk atas nama "${initialData?.name}"? Record ini akan hilang selamanya dari database desa.`}
        variant="danger"
        requirePhrase={initialData?.name}
        confirmLabel="Hapus Permanen"
        loading={isDeleting}
      />
    </div>
  );
}
