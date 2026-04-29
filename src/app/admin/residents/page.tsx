import ResidentTable from '@/components/modules/residents/ResidentTable';
import { Users } from 'lucide-react';
import ResetDataButton from '@/components/modules/statistics/ResetDataButton';

export default function AdminResidentsPage() {
  return (
    <div className="space-y-6 sm:space-y-8 pb-20">
      <div className="bg-card p-5 sm:p-6 rounded-2xl sm:rounded-3xl border border-border shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="p-2 sm:p-2.5 bg-muted rounded-xl border border-border flex items-center justify-center text-primary shrink-0">
            <Users size={20} />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">Master Data Penduduk</h1>
            <p className="text-xs sm:text-sm text-muted-foreground mt-0.5 font-medium">Kelola data individual penduduk desa, audit log, dan filter wilayah.</p>
          </div>
        </div>
        <div className="shrink-0 w-full lg:w-auto">
          <ResetDataButton />
        </div>
      </div>

      <ResidentTable />
    </div>
  );
}
