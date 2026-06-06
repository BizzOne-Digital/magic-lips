"use client";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import ScrollToTop from "@/components/ui/ScrollToTop";
import { isMobileClient } from "@/lib/isMobileClient";

const SmoothScroll   = dynamic(() => import("@/components/ui/SmoothScroll"),   { ssr: false });
const MagicCursor    = dynamic(() => import("@/components/ui/MagicCursor"),    { ssr: false });
const ParticleField  = dynamic(() => import("@/components/ui/ParticleField"),  { ssr: false });

export default function SiteEffects({
  children,
  particles = false,
}: {
  children: React.ReactNode;
  particles?: boolean;
}) {
  const [mobile, setMobile] = useState(true);

  useEffect(() => {
    setMobile(isMobileClient());
  }, []);

  const showParticles = particles && !mobile;

  return (
    <SmoothScroll>
      <ScrollToTop />
      {!mobile && <MagicCursor />}
      {showParticles && <ParticleField count={35} />}
      {children}
    </SmoothScroll>
  );
}
