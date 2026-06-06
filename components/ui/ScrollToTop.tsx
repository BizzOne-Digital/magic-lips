"use client";
import { useEffect } from "react";
import { usePathname } from "next/navigation";

export default function ScrollToTop() {
  const pathname = usePathname();

  useEffect(() => {
    if ("scrollRestoration" in history) {
      history.scrollRestoration = "manual";
    }
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
    // Recalculate layout on first paint (fixes mobile horizontal gap on load)
    requestAnimationFrame(() => {
      window.dispatchEvent(new Event("resize"));
    });
  }, [pathname]);

  return null;
}
