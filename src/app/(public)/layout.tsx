import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import ServiceFloater from "@/components/layout/ServiceFloater";
import ViewTracker from "@/components/layout/ViewTracker";
import { getVillageInfo } from "@/services/data-service";

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const villageInfo = await getVillageInfo();

  return (
    <>
      <ViewTracker />
      <Header initialData={villageInfo} />
      <div className="animate-in fade-in duration-500">
        {children}
      </div>
      <Footer initialData={villageInfo} />
      {/* Floating Service Request Button */}
      <ServiceFloater />
    </>
  );
}
