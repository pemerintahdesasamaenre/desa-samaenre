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
      <div>
        {children}
      </div>
      <Footer />
      {/* Floating Service Request Button */}
      <ServiceFloater />
    </>
  );
}
