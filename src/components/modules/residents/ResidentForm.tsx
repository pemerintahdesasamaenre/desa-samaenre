'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { upsertResident, deleteResident } from '@/actions/residents';
import { Save, Loader2, ArrowLeft, User, Contact, MapPin, Calendar, Briefcase, Users, Eye, EyeOff, Trash2, Heart, GraduationCap, Edit3, CheckCircle2, ShieldAlert } from 'lucide-react';
import Link from 'next/link';
import CustomSelect from '@/components/ui/CustomSelect';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Resident } from '@/types';
import { toast } from 'sonner';

interface ResidentFormProps {
  initialData?: Partial<Resident> & { id?: string };
  isEditing?: boolean;
}

const GENDER_OPTIONS = [
  { id: 'L', name: 'Laki-laki' },
  { id: 'P', name: 'Perempuan' }
];

const DUSUN_OPTIONS = [
  { id: 'BT. SIRING', name: 'BT. SIRING' },
  { id: 'MALEMPO', name: 'MALEMPO' },
  { id: 'MALLENRENG', name: 'MALLENRENG' },
  { id: 'REALOLO', name: 'REALOLO' },
  { id: 'CUSTOM', name: '... Input Manual' },
];

const EDUCATION_OPTIONS = [
  { id: 'Belum / Tidak Sekolah', name: 'Belum / Tidak Sekolah' },
  { id: 'SD / Sederajat', name: 'SD / Sederajat' },
  { id: 'SMP / Sederajat', name: 'SMP / Sederajat' },
  { id: 'SMA / Sederajat', name: 'SMA / Sederajat' },
  { id: 'Diploma / Sarjana', name: 'Diploma / Sarjana' },
  { id: 'CUSTOM', name: '... Input Manual' },
];

const OCCUPATION_OPTIONS = [
  { id: 'Petani / Pekebun', name: 'Petani / Pekebun' },
  { id: 'Pelajar / Mahasiswa', name: 'Pelajar / Mahasiswa' },
  { id: 'Ibu Rumah Tangga', name: 'Ibu Rumah Tangga' },
  { id: 'Pegawai / ASN', name: 'Pegawai / ASN' },
  { id: 'Swasta / Karyawan', name: 'Swasta / Karyawan' },
  { id: 'Wiraswasta / Jasa', name: 'Wiraswasta / Jasa' },
  { id: 'Tidak / Belum Bekerja', name: 'Tidak / Belum Bekerja' },
  { id: 'CUSTOM', name: '... Input Manual' },
];

const MARITAL_OPTIONS = [
  { id: 'Belum Kawin', name: 'Belum Kawin' },
  { id: 'Kawin', name: 'Kawin' },
  { id: 'Cerai Hidup', name: 'Cerai Hidup' },
  { id: 'Cerai Mati', name: 'Cerai Mati' },
];

const RELATIONSHIP_OPTIONS = [
  { id: 'KEPALA KELUARGA', name: 'KEPALA KELUARGA' },
  { id: 'SUAMI', name: 'SUAMI' },
  { id: 'ISTRI', name: 'ISTRI' },
  { id: 'ANAK', name: 'ANAK' },
  { id: 'ORANG TUA', name: 'ORANG TUA' },
  { id: 'MERTUA', name: 'MERTUA' },
  { id: 'CUCU', name: 'CUCU' },
  { id: 'MENANTU', name: 'MENANTU' },
  { id: 'LAINNYA', name: 'LAINNYA' },
];

export default function ResidentForm({ initialData, isEditing }: ResidentFormProps) {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const [loading, setLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [showNik, setShowNik] = useState(false);
  const [showKk, setShowKk] = useState(false);
  const [showSaveConfirm, setShowSaveConfirm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Custom Input State
  const [customDusun, setCustomDusun] = useState(() => 
    !!initialData?.dusun && !DUSUN_OPTIONS.find(o => o.id === initialData.dusun)
  );
  const [customEdu, setCustomEdu] = useState(() => 
    !!initialData?.education && !EDUCATION_OPTIONS.find(o => o.id === initialData.education)
  );
  const [customOcc, setCustomOcc] = useState(() => 
    !!initialData?.occupation && !OCCUPATION_OPTIONS.find(o => o.id === initialData.occupation)
  );

  const [dusunVal, setDusunVal] = useState(initialData?.dusun || '');
  const [eduVal, setEduVal] = useState(initialData?.education || '');
  const [occVal, setOccVal] = useState(initialData?.occupation || '');

  const TARGET_SAVE_PHRASE = "SAYA BERTANGGUNG JAWAB";

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
    setSuccess(null);
    setShowSaveConfirm(false);

    const formData = new FormData(formRef.current!);
    const data = {
      nik: formData.get('nik') as string,
      kk: formData.get('kk') as string,
      name: formData.get('name') as string,
      birth_place: formData.get('birth_place') as string || '',
      birth_date: formData.get('birth_date') as string || null,
      gender: formData.get('gender') as 'L' | 'P',
      education: customEdu ? dusunVal : (formData.get('education') as string), // Fix: should be eduVal, logic corrected below
      occupation: customOcc ? occVal : (formData.get('occupation') as string),
      marital_status: formData.get('marital_status') as string,
      father_name: formData.get('father_name') as string || '',
      mother_name: formData.get('mother_name') as string || '',
      dusun: customDusun ? dusunVal : (formData.get('dusun') as string),
      rt: formData.get('rt') as string || '',
      rw: formData.get('rw') as string || '',
      data_year: parseInt(formData.get('data_year') as string, 10) || new Date().getFullYear(),
    };

    // Re-check education mapping from state
    data.education = customEdu ? eduVal : data.education;

    const toastId = toast.loading('Menyimpan data penduduk...');
    try {
      const result = await upsertResident(data, isEditing ? initialData?.id : undefined);
      if (result.error) {
        setError(result.error as string);
        toast.error('Gagal menyimpan: ' + result.error, { id: toastId });
        setLoading(false);
      } else {
        const successMsg = isEditing ? 'Data penduduk diperbarui!' : 'Penduduk baru ditambahkan!';
        setSuccess(successMsg);
        toast.success(successMsg, { id: toastId });
        
        // Use a slightly longer delay to ensure the user sees the toast
        setTimeout(() => {
          router.push('/admin/residents');
          router.refresh();
        }, 1500);
      }
    } catch (e: unknown) {
      const errorMsg = e instanceof Error ? e.message : 'Gagal menyimpan data.';
      setError(errorMsg);
      toast.error(errorMsg, { id: toastId });
      setLoading(false);
    }
  }

  async function handleDelete() {
    if (!initialData?.id) return;
    setIsDeleting(true);
    setShowDeleteConfirm(false);
    const toastId = toast.loading(`Menghapus data "${initialData.name}"...`);
    try {
      const result = await deleteResident(initialData.id);
      if (result.success) {
        toast.success(`Data "${initialData.name}" berhasil dihapus`, { id: toastId });
        setSuccess('Data penduduk telah dihapus permanen.');
        setTimeout(() => {
          router.push('/admin/residents');
          router.refresh();
        }, 1500);
      } else {
        toast.error('Gagal menghapus: ' + result.error, { id: toastId });
        setIsDeleting(false);
      }
    } catch {
      toast.error('Terjadi kesalahan sistem.', { id: toastId });
      setIsDeleting(false);
    }
  }

  return (
    <div className="max-w-4xl mx-auto pb-20 px-2 sm:px-0">
      <div className="mb-4 sm:mb-6 flex items-center justify-between">
        <Link
          href="/admin/residents"
          className="text-muted-foreground hover:text-primary flex items-center gap-2 transition-colors font-bold uppercase text-[9px] sm:text-[10px] tracking-widest"
        >
          <ArrowLeft size={16} />
          Kembali ke Daftar
        </Link>

        {isEditing && !success && (
          <button
            type="button"
            onClick={() => setShowDeleteConfirm(true)}
            className="flex items-center gap-2 text-destructive hover:bg-destructive/10 font-bold text-[9px] sm:text-[10px] uppercase tracking-widest bg-destructive/5 px-4 py-2 sm:px-6 sm:py-3 rounded-full border border-destructive/20 active:scale-95"
          >
            <Trash2 size={14} />
            Hapus Record
          </button>
        )}
      </div>

      <div className="bg-card rounded-2xl sm:rounded-3xl border border-border shadow-sm overflow-hidden">
        <div className="p-6 sm:p-8 border-b border-border bg-muted/30">
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight uppercase">
            {isEditing ? 'Update Data Penduduk' : 'Input Penduduk Baru'}
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1 font-medium italic">
            Seluruh perubahan akan tervalidasi dan tercatat dalam sistem audit desa.
          </p>
        </div>

        <div className="px-6 sm:px-10 pt-6 sm:pt-10">
          {error && (
            <div className="p-4 bg-destructive/10 border border-destructive/20 text-destructive rounded-2xl text-xs sm:text-sm font-bold flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
              <ShieldAlert size={18} />
              {error}
            </div>
          )}
          {success && (
            <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 rounded-2xl text-xs sm:text-sm font-bold uppercase tracking-widest flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
              <CheckCircle2 size={18} />
              {success}
            </div>
          )}
        </div>

        <form ref={formRef} onSubmit={handleOpenSaveConfirm} className={`p-6 sm:p-10 space-y-10 sm:space-y-12 transition-opacity duration-500 ${success ? 'opacity-30 pointer-events-none' : 'opacity-100'}`}>
          {/* Section 1: Identitas Utama */}
          <div className="space-y-6 sm:space-y-8">
            <div className="flex items-center gap-3 border-b border-border pb-4">
              <div className="p-1.5 sm:p-2 bg-primary/10 text-primary rounded-lg">
                <Contact size={18} />
              </div>
              <h3 className="text-xs sm:text-sm font-bold uppercase tracking-[0.2em] text-foreground">Identitas Utama</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-8">
              <div className="space-y-2">
                <Label>NIK (16 Digit)</Label>
                <div className="relative">
                  <Input
                    name="nik"
                    type={showNik ? "text" : "password"}
                    defaultValue={initialData?.nik || ''}
                    required
                    maxLength={16}
                    placeholder="Masukkan NIK 16 Digit"
                    className="font-mono tracking-widest h-11 sm:h-12 text-sm"
                  />
                  <button type="button" onClick={() => setShowNik(!showNik)} className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary">
                    {showNik ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
              <div className="space-y-2">
                <Label>No. Kartu Keluarga (16 Digit)</Label>
                <div className="relative">
                  <Input
                    name="kk"
                    type={showKk ? "text" : "password"}
                    defaultValue={initialData?.kk || ''}
                    required
                    maxLength={16}
                    placeholder="Masukkan No. KK 16 Digit"
                    className="font-mono tracking-widest h-11 sm:h-12 text-sm"
                  />
                  <button type="button" onClick={() => setShowKk(!showKk)} className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary">
                    {showKk ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label>Nama Lengkap (Sesuai KTP)</Label>
                <Input
                  name="name"
                  defaultValue={initialData?.name || ''}
                  required
                  placeholder="NAMA LENGKAP"
                  className="uppercase font-bold h-11 sm:h-12 tracking-tight text-sm"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Kelahiran & Gender */}
          <div className="space-y-6 sm:space-y-8 pt-4 sm:pt-6 border-t border-border">
            <div className="flex items-center gap-3 border-b border-border pb-4">
              <div className="p-1.5 sm:p-2 bg-primary/10 text-primary rounded-lg">
                <Calendar size={18} />
              </div>
              <h3 className="text-xs sm:text-sm font-bold uppercase tracking-[0.2em] text-foreground">Kelahiran & Gender</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 sm:gap-8">
              <div className="space-y-2">
                <Label>Tempat Lahir</Label>
                <Input name="birth_place" defaultValue={initialData?.birth_place || ''} placeholder="KOTA / KABUPATEN" className="uppercase h-11 sm:h-12 text-sm" />
              </div>
              <div className="space-y-2">
                <Label>Tanggal Lahir</Label>
                <Input name="birth_date" type="date" defaultValue={initialData?.birth_date || ''} required className="h-11 sm:h-12 text-sm" />
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

          {/* Section 3: Domisili */}
          <div className="space-y-6 sm:space-y-8 pt-4 sm:pt-6 border-t border-border">
            <div className="flex items-center gap-3 border-b border-border pb-4">
              <div className="p-1.5 sm:p-2 bg-primary/10 text-primary rounded-lg">
                <MapPin size={18} />
              </div>
              <h3 className="text-xs sm:text-sm font-bold uppercase tracking-[0.2em] text-foreground">Domisili (Alamat)</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 sm:gap-8">
              <div className="space-y-2 sm:col-span-1">
                {customDusun ? (
                  <div className="space-y-2 animate-in slide-in-from-left-1">
                    <div className="flex justify-between items-center">
                      <Label>Nama Dusun (Manual)</Label>
                      <button type="button" onClick={() => setCustomDusun(false)} className="text-[9px] font-bold text-primary uppercase">Kembali ke List</button>
                    </div>
                    <div className="relative">
                      <Input
                        value={dusunVal}
                        onChange={(e) => setDusunVal(e.target.value.toUpperCase())}
                        placeholder="INPUT NAMA DUSUN"
                        className="uppercase h-11 sm:h-12 pl-10 text-sm font-bold text-primary border-primary/30"
                        autoFocus
                      />
                      <Edit3 size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-primary" />
                    </div>
                  </div>
                ) : (
                  <CustomSelect
                    label="Nama Dusun"
                    name="dusun"
                    options={DUSUN_OPTIONS}
                    defaultValue={initialData?.dusun || ''}
                    icon={MapPin}
                    onChange={(val) => { if (val === 'CUSTOM') setCustomDusun(true); }}
                    required
                  />
                )}
              </div>
              <div className="space-y-2">
                <Label>RT</Label>
                <Input name="rt" defaultValue={initialData?.rt || ''} placeholder="000" className="font-mono h-11 sm:h-12 text-sm text-center" />
              </div>
              <div className="space-y-2">
                <Label>RW</Label>
                <Input name="rw" defaultValue={initialData?.rw || ''} placeholder="000" className="font-mono h-11 sm:h-12 text-sm text-center" />
              </div>
            </div>
          </div>

          {/* Section 4: Sosial & Ekonomi */}
          <div className="space-y-6 sm:space-y-8 pt-4 sm:pt-6 border-t border-border">
            <div className="flex items-center gap-3 border-b border-border pb-4">
              <div className="p-1.5 sm:p-2 bg-primary/10 text-primary rounded-lg">
                <Briefcase size={18} />
              </div>
              <h3 className="text-xs sm:text-sm font-bold uppercase tracking-[0.2em] text-foreground">Sosial & Ekonomi</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-8">
              <div className="space-y-2">
                {customEdu ? (
                  <div className="space-y-2 animate-in slide-in-from-left-1">
                    <div className="flex justify-between items-center">
                      <Label>Pendidikan (Manual)</Label>
                      <button type="button" onClick={() => setCustomEdu(false)} className="text-[9px] font-bold text-primary uppercase">Kembali ke List</button>
                    </div>
                    <div className="relative">
                      <Input
                        value={eduVal}
                        onChange={(e) => setEduVal(e.target.value.toUpperCase())}
                        placeholder="INPUT PENDIDIKAN"
                        className="uppercase h-11 sm:h-12 pl-10 text-sm font-bold text-primary border-primary/30"
                        autoFocus
                      />
                      <GraduationCap size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-primary" />
                    </div>
                  </div>
                ) : (
                  <CustomSelect
                    label="Pendidikan Terakhir"
                    name="education"
                    options={EDUCATION_OPTIONS}
                    defaultValue={initialData?.education || ''}
                    icon={GraduationCap}
                    onChange={(val) => { if (val === 'CUSTOM') setCustomEdu(true); }}
                    required
                  />
                )}
              </div>
              <div className="space-y-2">
                {customOcc ? (
                  <div className="space-y-2 animate-in slide-in-from-left-1">
                    <div className="flex justify-between items-center">
                      <Label>Pekerjaan (Manual)</Label>
                      <button type="button" onClick={() => setCustomOcc(false)} className="text-[9px] font-bold text-primary uppercase">Kembali ke List</button>
                    </div>
                    <div className="relative">
                      <Input
                        value={occVal}
                        onChange={(e) => setOccVal(e.target.value.toUpperCase())}
                        placeholder="INPUT PEKERJAAN"
                        className="uppercase h-11 sm:h-12 pl-10 text-sm font-bold text-primary border-primary/30"
                        autoFocus
                      />
                      <Briefcase size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-primary" />
                    </div>
                  </div>
                ) : (
                  <CustomSelect
                    label="Pekerjaan Utama"
                    name="occupation"
                    options={OCCUPATION_OPTIONS}
                    defaultValue={initialData?.occupation || ''}
                    icon={Briefcase}
                    onChange={(val) => { if (val === 'CUSTOM') setCustomOcc(true); }}
                    required
                  />
                )}
              </div>
              <div className="space-y-2">
                <CustomSelect
                  label="Status Perkawinan"
                  name="marital_status"
                  options={MARITAL_OPTIONS}
                  defaultValue={initialData?.marital_status || ''}
                  icon={Heart}
                  required
                />
              </div>
              <div className="space-y-2">
                <CustomSelect
                  label="Hubungan Keluarga"
                  name="family_relationship"
                  options={RELATIONSHIP_OPTIONS}
                  defaultValue={initialData?.family_relationship || ''}
                  icon={Users}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Tahun Pendataan</Label>
                <Input name="data_year" type="number" defaultValue={initialData?.data_year || new Date().getFullYear()} required className="font-mono h-11 sm:h-12 text-sm" />
              </div>
            </div>
          </div>

          {/* Section 5: Orang Tua */}
          <div className="space-y-6 sm:space-y-8 pt-4 sm:pt-6 border-t border-border">
            <div className="flex items-center gap-3 border-b border-border pb-4">
              <div className="p-1.5 sm:p-2 bg-primary/10 text-primary rounded-lg">
                <Users size={18} />
              </div>
              <h3 className="text-xs sm:text-sm font-bold uppercase tracking-[0.2em] text-foreground">Data Orang Tua</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-8">
              <div className="space-y-2">
                <Label>Nama Lengkap Ayah</Label>
                <Input name="father_name" defaultValue={initialData?.father_name || ''} placeholder="AYAH KANDUNG" className="uppercase h-11 sm:h-12 text-sm" />
              </div>
              <div className="space-y-2">
                <Label>Nama Lengkap Ibu</Label>
                <Input name="mother_name" defaultValue={initialData?.mother_name || ''} placeholder="IBU KANDUNG" className="uppercase h-11 sm:h-12 text-sm" />
              </div>
            </div>
          </div>

          <div className="pt-8 sm:pt-10 border-t border-border flex flex-col sm:flex-row justify-end gap-4">
            <button
              type="submit"
              disabled={loading || !!success}
              className="w-full sm:w-auto bg-primary text-primary-foreground px-10 py-4 sm:px-12 sm:py-5 rounded-full font-bold flex items-center justify-center gap-3 hover:opacity-90 disabled:opacity-50 transition-all shadow-xl shadow-primary/20 text-[10px] sm:text-xs tracking-widest uppercase active:scale-95"
            >
              {loading && !success ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
              {isEditing ? 'Simpan Seluruh Perubahan' : 'Simpan Data Penduduk'}
            </button>
          </div>
        </form>
      </div>

      <ConfirmDialog
        isOpen={showSaveConfirm}
        onClose={() => setShowSaveConfirm(false)}
        onConfirm={handleSave}
        title="Validasi Data"
        description="Apakah Anda yakin data kependudukan ini sudah sesuai dengan dokumen resmi kependudukan yang berlaku?"
        requirePhrase={TARGET_SAVE_PHRASE}
        confirmLabel="Ya, Saya Bertanggung Jawab"
        loading={loading}
      />

      <ConfirmDialog
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleDelete}
        title="Hapus Data Permanen"
        description={`Anda akan menghapus data penduduk atas nama "${initialData?.name}". Seluruh history kependudukan untuk orang ini akan hilang.`}
        variant="danger"
        requirePhrase={initialData?.name}
        confirmLabel="Hapus Sekarang"
        loading={isDeleting}
      />
    </div>
  );
}
