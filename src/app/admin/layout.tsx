import { Sidebar } from '@/components/layout/Sidebar';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex transition-colors duration-300">
      {/* Sidebar with responsive behavior */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 lg:ml-64 p-4 md:p-8 pt-20 lg:pt-8 transition-all duration-300">
        <div className="max-w-6xl mx-auto text-slate-900 dark:text-slate-100">
          {children}
        </div>
      </div>
    </div>
  );
}
