import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import SiteEffects from "@/components/ui/SiteEffects";
import HeroSlider from "@/components/home/HeroSlider";
import NewsletterSection from "@/components/home/NewsletterSection";
import FounderSection from "@/components/home/FounderSection";
import CategoriesSection from "@/components/home/CategoriesSection";
import OffersSection from "@/components/home/OffersSection";
import GalleryPreview from "@/components/home/GalleryPreview";
import AboutSection from "@/components/home/AboutSection";
import ContactSection from "@/components/home/ContactSection";

export default function HomePage() {
  return (
    <SiteEffects>
      <div className="min-h-screen w-full overflow-x-clip bg-white">
        <Header />
        <main>
          <HeroSlider />
          <NewsletterSection />
          <FounderSection />
          <CategoriesSection />
          <OffersSection />
          <GalleryPreview />
          <AboutSection />
          <ContactSection />
        </main>
        <Footer />
      </div>
    </SiteEffects>
  );
}
