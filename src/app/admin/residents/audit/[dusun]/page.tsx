import { getIncompleteResidents } from '@/actions/residents';
import { ArrowLeft, AlertTriangle, Edit2 } from 'lucide-react';
import Link from 'next/link';

interface PageProps {
  params: Promise<{ dusun: string }>;
}

const FIELD_LABELS: Record<string, string> = {
  nik: 'NIK',
  kk: 'No. KK',
  name: 'Nama',
  birth_place: 'Tempat Lahir',
  birth_date: 'Tanggal Lahir',
  gender: 'Jenis Kelamin',
  education: 'Pendidikan',
  occupation: 'Pekerjaan',
  marital_status: 'Status Perkawinan',
  family_relationship: 'Hubungan Keluarga',
  father_name: 'Nama Ayah',
  mother_name: 'Nama Ibu',
  dusun: 'Dusun',
  data_year: 'Tahun Data'
};

export default async function DusunAuditPage({ params }: PageProps) {
  const { dusun } = await params;
  const decodedDusun = decodeURIComponent(dusun);
  const residents = await getIncompleteResidents(decodedDusun);

  return (
    <div className="space-y-6 sm:space-y-8 pb-20">
      <div className="bg-card p-5 sm:p-6 rounded-2xl sm:rounded-3xl border border-border shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <Link 
            href="/admin/residents/audit"
            className="p-2 sm:p-2.5 bg-muted rounded-xl border border-border flex items-center justify-center text-muted-foreground hover:text-primary transition-colors shrink-0"
          >
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight underline decoration-primary/30 decoration-4 underline-offset-8">Dusun {decodedDusun}</h1>
            <p className="text-xs sm:text-sm text-muted-foreground mt-3 font-medium flex items-center gap-2">
               <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
               Lengkapi {residents.length} data penduduk di wilayah ini.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {residents.map((r) => (
          <div key={r.id} className="bg-card p-5 rounded-2xl border border-border shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-primary/30 transition-all group">
            <div className="space-y-3">
              <div>
                <h3 className="font-black text-foreground text-lg leading-none group-hover:text-primary transition-colors">{r.name}</h3>
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-1">RT {r.rt} / RW {r.rw}</p>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {r.missing_fields.map(field => (
                  <span key={field} className="px-2 py-1 bg-destructive/5 text-destructive border border-destructive/20 rounded-lg text-[9px] font-bold uppercase tracking-widest flex items-center gap-1.5 shadow-sm">
                    <AlertTriangle size={10} />
                    {FIELD_LABELS[field] || field}
                  </span>
                ))}
              </div>
            </div>

            <Link 
              href={`/admin/residents/edit/${r.id}`}
              className="flex items-center justify-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-widest hover:opacity-90 transition-all shrink-0 shadow-lg shadow-primary/20 active:scale-95"
            >
              <Edit2 size={16} />
              Lengkapi Data
            </Link>
          </div>
        ))}

        {residents.length === 0 && (
          <div className="py-20 text-center bg-muted/30 rounded-3xl border border-dashed border-border">
            <p className="text-muted-foreground font-bold uppercase text-xs tracking-widest">Semua data di dusun ini sudah lengkap!</p>
          </div>
        )}
      </div>
    </div>
  );
}
