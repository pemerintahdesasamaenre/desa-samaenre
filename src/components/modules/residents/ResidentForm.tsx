'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { upsertResident } from '@/actions/residents';
import { Save, Loader2, ArrowLeft, User, Contact, MapPin, Calendar, Heart, Briefcase, GraduationCap, Users, Eye, EyeOff, AlertOctagon, X } from 'lucide-react';
import Link from 'next/link';
import CustomSelect from '@/components/ui/CustomSelect';

interface ResidentFormProps {
  initialData?: any;
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
  const [error, setError] = useState<any>(null);
  
  // State untuk visibilitas input
  const [showNik, setShowNik] = useState(false);
  const [showKk, setShowKk] = useState(false);
  
  // State untuk modal konfirmasi "mempersulit"
  const [showConfirm, setShowConfirm] = useState(false);
  const [confirmText, setConfirmText] = useState('');
  const TARGET_CONFIRM = "SAYA BERTANGGUNG JAWAB ATAS PERUBAHAN DATA INI";

  const handleOpenConfirm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formRef.current?.checkValidity()) {
      formRef.current?.reportValidity();
      return;
    }
    setShowConfirm(true);
  };

  async function handleFinalSubmit() {
    if (confirmText !== TARGET_CONFIRM) return;
    
    setLoading(true);
    setError(null);
    setShowConfirm(false);

    const formData = new FormData(formRef.current!);
    const data = {
      nik: formData.get('nik') as string,
      kk: formData.get('kk') as string,
      name: formData.get('name') as string,
      birth_place: formData.get('birth_place') as string,
      birth_date: formData.get('birth_date') as string || null,
      gender: formData.get('gender') as 'L' | 'P',
      education: formData.get('education') as string,
      occupation: formData.get('occupation') as string,
      marital_status: formData.get('marital_status') as string,
      father_name: formData.get('father_name') as string,
      mother_name: formData.get('mother_name') as string,
      dusun: formData.get('dusun') as string,
      rt: formData.get('rt') as string,
      rw: formData.get('rw') as string,
      data_year: parseInt(formData.get('data_year') as string, 10) || new Date().getFullYear(),
    };

    try {
      const result = await upsertResident(data, isEditing ? initialData.id : undefined);

      if (result.error) {
        setError(result.error);
      } else {
        router.push('/admin/residents');
        router.refresh();
      }
    } catch {
      setError('Gagal menyimpan data penduduk.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-4xl mx-auto pb-20">
      <div className="mb-6">
        <Link 
          href="/admin/residents" 
          className="text-slate-500 hover:text-slate-800 flex items-center gap-2 transition-colors font-medium"
        >
          <ArrowLeft size={18} />
          Kembali ke Daftar Penduduk
        </Link>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            {isEditing ? 'Edit Data Penduduk' : 'Tambah Penduduk Baru'}
          </h2>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Data ini bersifat hukum. Setiap perubahan akan dicatat dalam audit log permanen.
          </p>
        </div>

        <form ref={formRef} onSubmit={handleOpenConfirm} className="p-8 space-y-8">
          {typeof error === 'string' && (
            <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/30 text-red-600 dark:text-red-400 rounded-2xl text-sm font-medium">
              {error}
            </div>
          )}

          {/* Section 1: Identitas Utama */}
          <div className="space-y-6">
            <h3 className="text-sm font-black uppercase tracking-widest text-blue-600 flex items-center gap-2">
              <Contact size={18} />
              Identitas Utama
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Nomor Induk Kependudukan (NIK)</label>
                <div className="relative">
                  <input 
                    name="nik" 
                    type={showNik ? "text" : "password"}
                    defaultValue={initialData?.nik}
                    placeholder="16 digit NIK"
                    required
                    maxLength={16}
                    className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50/30 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all font-mono tracking-widest" 
                  />
                  <button 
                    type="button"
                    onClick={() => setShowNik(!showNik)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    {showNik ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {error?.nik && <p className="text-xs text-red-500 mt-1">{error.nik[0]}</p>}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Nomor Kartu Keluarga (KK)</label>
                <div className="relative">
                  <input 
                    name="kk" 
                    type={showKk ? "text" : "password"}
                    defaultValue={initialData?.kk}
                    placeholder="16 digit Nomor KK"
                    required
                    maxLength={16}
                    className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50/30 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all font-mono tracking-widest" 
                  />
                  <button 
                    type="button"
                    onClick={() => setShowKk(!showKk)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    {showKk ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {error?.kk && <p className="text-xs text-red-500 mt-1">{error.kk[0]}</p>}
              </div>

              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Nama Lengkap</label>
                <input 
                  name="name" 
                  defaultValue={initialData?.name}
                  placeholder="Sesuai KTP"
                  required
                  className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50/30 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all uppercase font-bold" 
                />
                {error?.name && <p className="text-xs text-red-500 mt-1">{error.name[0]}</p>}
              </div>
            </div>
          </div>

          {/* Section 2: Kelahiran & Gender */}
          <div className="space-y-6 pt-4 border-t border-slate-100 dark:border-slate-800">
            <h3 className="text-sm font-black uppercase tracking-widest text-blue-600 flex items-center gap-2">
              <Calendar size={18} />
              Kelahiran & Gender
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Tempat Lahir</label>
                <input 
                  name="birth_place" 
                  defaultValue={initialData?.birth_place}
                  placeholder="Kabupaten/Kota"
                  className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50/30 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all" 
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Tanggal Lahir</label>
                <input 
                  name="birth_date" 
                  type="date"
                  defaultValue={initialData?.birth_date}
                  required
                  className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50/30 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all" 
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

          {/* Section 3: Alamat Domisili */}
          <div className="space-y-6 pt-4 border-t border-slate-100 dark:border-slate-800">
            <h3 className="text-sm font-black uppercase tracking-widest text-blue-600 flex items-center gap-2">
              <MapPin size={18} />
              Alamat Domisili
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Dusun</label>
                <input 
                  name="dusun" 
                  defaultValue={initialData?.dusun}
                  placeholder="Nama Dusun"
                  className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50/30 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all" 
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 dark:text-slate-300">RT</label>
                <input 
                  name="rt" 
                  defaultValue={initialData?.rt}
                  placeholder="000"
                  className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50/30 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all font-mono" 
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 dark:text-slate-300">RW</label>
                <input 
                  name="rw" 
                  defaultValue={initialData?.rw}
                  placeholder="000"
                  className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50/30 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all font-mono" 
                />
              </div>
            </div>
          </div>

          {/* Section 4: Sosial & Ekonomi */}
          <div className="space-y-6 pt-4 border-t border-slate-100 dark:border-slate-800">
            <h3 className="text-sm font-black uppercase tracking-widest text-blue-600 flex items-center gap-2">
              <Briefcase size={18} />
              Sosial & Ekonomi
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                  <GraduationCap size={16} /> Pendidikan Terakhir
                </label>
                <input 
                  name="education" 
                  defaultValue={initialData?.education}
                  placeholder="Contoh: SMA / SEDERAJAT"
                  required
                  className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50/30 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all" 
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                  <Briefcase size={16} /> Pekerjaan Utama
                </label>
                <input 
                  name="occupation" 
                  defaultValue={initialData?.occupation}
                  placeholder="Contoh: PETANI / PEKEBUN"
                  required
                  className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50/30 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all" 
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                  <Heart size={16} /> Status Perkawinan
                </label>
                <input 
                  name="marital_status" 
                  defaultValue={initialData?.marital_status}
                  placeholder="Contoh: KAWIN"
                  required
                  className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50/30 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all" 
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Tahun Data</label>
                <input 
                  name="data_year" 
                  type="number"
                  defaultValue={initialData?.data_year || new Date().getFullYear()}
                  required
                  className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50/30 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all font-mono" 
                />
              </div>
            </div>
          </div>

          {/* Section 5: Orang Tua */}
          <div className="space-y-6 pt-4 border-t border-slate-100 dark:border-slate-800">
            <h3 className="text-sm font-black uppercase tracking-widest text-blue-600 flex items-center gap-2">
              <Users size={18} />
              Data Orang Tua
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Nama Ayah</label>
                <input 
                  name="father_name" 
                  defaultValue={initialData?.father_name}
                  placeholder="Nama Ayah Kandung"
                  className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50/30 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all" 
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Nama Ibu</label>
                <input 
                  name="mother_name" 
                  defaultValue={initialData?.mother_name}
                  placeholder="Nama Ibu Kandung"
                  className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50/30 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all" 
                />
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-slate-100 dark:border-slate-800 flex justify-end">
            <button 
              type="submit" 
              disabled={loading}
              className="bg-blue-600 text-white px-10 py-4 rounded-2xl font-black flex items-center gap-3 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-xl shadow-blue-500/25 active:scale-95"
            >
              {loading ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
              {isEditing ? 'SIMPAN PERUBAHAN' : 'TAMBAH PENDUDUK'}
            </button>
          </div>
        </form>
      </div>

      {/* MODAL KONFIRMASI YANG MEMPERSULIT */}
      {showConfirm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 w-full max-w-xl rounded-[2.5rem] shadow-2xl border border-red-200 dark:border-red-900/30 overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-8 border-b border-red-50 dark:border-red-900/20 flex justify-between items-center bg-red-50/50 dark:bg-red-900/10">
              <div className="flex items-center gap-4 text-red-600">
                <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-2xl">
                  <AlertOctagon size={32} />
                </div>
                <div>
                  <h3 className="text-xl font-black tracking-tight">KONFIRMASI INTEGRITAS DATA</h3>
                  <p className="text-xs font-bold text-red-500/70 uppercase tracking-widest">High-Level Security Protocol</p>
                </div>
              </div>
              <button onClick={() => setShowConfirm(false)} className="p-2 text-slate-400 hover:text-slate-600 transition-colors">
                <X size={24} />
              </button>
            </div>

            <div className="p-10 space-y-8">
              <div className="space-y-4">
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                  Anda sedang mencoba mengubah/menambahkan data kependudukan resmi. Kesalahan penginputan data dapat berakibat pada validitas statistik desa.
                </p>
                <div className="p-6 bg-slate-50 dark:bg-slate-800/50 rounded-3xl border border-slate-100 dark:border-slate-800">
                  <p className="text-sm font-bold text-slate-500 mb-4 uppercase tracking-tighter">Salin kalimat di bawah untuk melanjutkan:</p>
                  <p className="text-lg font-black text-slate-900 dark:text-white select-all cursor-copy break-words italic">
                    &quot;{TARGET_CONFIRM}&quot;
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <input
                  type="text"
                  value={confirmText}
                  onChange={(e) => setConfirmText(e.target.value)}
                  placeholder="Ketik kalimat konfirmasi di sini..."
                  className="w-full px-6 py-4 rounded-2xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:border-blue-500 outline-none transition-all font-bold tracking-tight text-center"
                />
              </div>

              <div className="flex flex-col gap-3">
                <button
                  onClick={handleFinalSubmit}
                  disabled={confirmText !== TARGET_CONFIRM || loading}
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-30 disabled:grayscale text-white font-black py-5 rounded-3xl transition-all shadow-2xl shadow-blue-500/40 flex items-center justify-center gap-3 text-lg"
                >
                  {loading ? <Loader2 className="animate-spin" /> : <Save size={24} />}
                  SAYA YAKIN DAN SIMPAN SEKARANG
                </button>
                <button
                  onClick={() => setShowConfirm(false)}
                  className="w-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 font-bold py-4 rounded-2xl hover:bg-slate-200 transition-all text-sm"
                >
                  BATALKAN PERUBAHAN
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

