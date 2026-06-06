"use client";
import { useState, useEffect } from "react";
import Header          from "@/components/layout/Header";
import Footer          from "@/components/layout/Footer";
import IntroAnimation  from "@/components/IntroAnimation";
import SiteEffects     from "@/components/ui/SiteEffects";
import HeroSlider      from "@/components/home/HeroSlider";
import OfferStrip         from "@/components/home/OfferStrip";
import CategoriesSection  from "@/components/home/CategoriesSection";
import FeaturedProducts   from "@/components/home/FeaturedProducts";
import NewsletterSection  from "@/components/home/NewsletterSection";
import OffersSection      from "@/components/home/OffersSection";
import GalleryPreview     from "@/components/home/GalleryPreview";
import AboutSection       from "@/components/home/AboutSection";
import SocialSection      from "@/components/home/SocialSection";
import ContactSection     from "@/components/home/ContactSection";
import { isMobileClient } from "@/lib/isMobileClient";

export default function HomePage() {
  const [showIntro, setShowIntro] = useState(false);

  useEffect(() => {
    const seen = sessionStorage.getItem("intro-seen");
    const mobile = isMobileClient();
    if (!seen && !mobile) setShowIntro(true);
  }, []);

  const handleIntroComplete = () => {
    sessionStorage.setItem("intro-seen", "1");
    setShowIntro(false);
  };

  return (
    <>
      {showIntro && <IntroAnimation onComplete={handleIntroComplete} />}

      <SiteEffects particles>
        <div className="relative min-h-screen w-full overflow-x-clip" style={{ zIndex: 2 }}>
          <Header />
          <main className="w-full overflow-x-clip">
            <HeroSlider />
            <OfferStrip />
            <CategoriesSection />
            <FeaturedProducts />
            <NewsletterSection />
            <OffersSection />
            <GalleryPreview />
            <AboutSection />
            <SocialSection />
            <ContactSection />
          </main>
          <Footer />
        </div>
      </SiteEffects>
    </>
  );
}
