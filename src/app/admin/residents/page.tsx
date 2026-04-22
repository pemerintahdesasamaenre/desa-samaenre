import ResidentTable from '@/components/modules/residents/ResidentTable';
import { Users } from 'lucide-react';
import ResetDataButton from '@/components/modules/statistics/ResetDataButton';

export default function AdminResidentsPage() {
  return (
    <div className="space-y-6 md:space-y-8 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="p-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 rounded-xl">
              <Users size={24} />
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">Master Data Penduduk</h1>
          </div>
          <p className="text-slate-500 dark:text-slate-400 text-sm md:text-base">
            Kelola data individual penduduk desa, termasuk pencarian detail dan filter wilayah.
          </p>
          <div className="mt-2">
            <ResetDataButton />
          </div>
        </div>
      </div>

      <ResidentTable />
    </div>
  );
}
