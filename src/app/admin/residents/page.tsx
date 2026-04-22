import ResidentTable from '@/components/modules/residents/ResidentTable';
import { Users } from 'lucide-react';
import ResetDataButton from '@/components/modules/statistics/ResetDataButton';

export default function AdminResidentsPage() {
  return (
    <div className="space-y-10 pb-20 px-4 md:px-0">
      <div className="bg-card p-8 rounded-[2.5rem] border border-border shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-4 mb-2">
            <div className="p-3 bg-primary/10 text-primary rounded-2xl border border-primary/10">
              <Users size={28} />
            </div>
            <h1 className="text-4xl font-black text-foreground tracking-tighter">Master Data Penduduk</h1>
          </div>
          <p className="text-muted-foreground font-medium italic">
            Kelola data individual penduduk desa, termasuk pencarian detail, audit log, dan filter wilayah.
          </p>
        </div>
        <div className="shrink-0">
          <ResetDataButton />
        </div>
      </div>

      <ResidentTable />
    </div>
  );
}
