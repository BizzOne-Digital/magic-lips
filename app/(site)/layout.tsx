import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import OfferStrip from "@/components/home/OfferStrip";
import SiteEffects from "@/components/ui/SiteEffects";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <SiteEffects>
      <div className="min-h-screen flex flex-col w-full overflow-x-clip">
        <Header />
        <OfferStrip />
        <main className="flex-1 w-full overflow-x-clip">{children}</main>
        <Footer />
      </div>
    </SiteEffects>
  );
}
