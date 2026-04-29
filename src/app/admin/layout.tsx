import { Sidebar } from '@/components/layout/Sidebar';
import { Toaster } from 'sonner';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background flex transition-colors duration-300 overflow-x-hidden">
      {/* Sidebar with responsive behavior */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 lg:ml-64 p-3 sm:p-5 md:p-6 pt-20 lg:pt-8 transition-all duration-300 min-w-0">
        <div className="max-w-6xl mx-auto text-foreground">
          {children}
        </div>
      </div>
      <Toaster position="top-right" richColors />
    </div>
  );
}
