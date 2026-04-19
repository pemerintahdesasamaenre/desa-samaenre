import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import ServiceFloater from "@/components/layout/ServiceFloater";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <div className="pt-20">
        {children}
      </div>
      <Footer />
      {/* Floating Service Request Button */}
      <ServiceFloater />
    </>
  );
}
