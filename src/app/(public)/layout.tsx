import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import ServiceFloater from "@/components/layout/ServiceFloater";
import ViewTracker from "@/components/layout/ViewTracker";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <ViewTracker />
      <Header />
      <div className="animate-in fade-in duration-500">
        {children}
      </div>
      <Footer />
      {/* Floating Service Request Button */}
      <ServiceFloater />
    </>
  );
}
