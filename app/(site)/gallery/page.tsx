"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import Sparkles from "@/components/ui/Sparkles";
import { resolveGalleryMedia, toStaticGallery, type GalleryMediaItem } from "@/lib/galleryImages";

export default function GalleryPage() {
  const [media, setMedia] = useState<GalleryMediaItem[]>(() => toStaticGallery());
  const { ref, inView } = useInView({ triggerOnce: true });

  useEffect(() => {
    fetch("/api/gallery")
      .then((r) => r.json())
      .then((d) => setMedia(resolveGalleryMedia(d.media)))
      .catch(() => setMedia(toStaticGallery()));
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <section className="relative pt-16 pb-12 md:pt-24 md:pb-16 overflow-hidden">
        <Sparkles count={16} />
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(196,181,253,0.2) 0%, transparent 70%)" }}
        />
        <div className="relative z-10 text-center px-4 sm:px-6 max-w-3xl mx-auto">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-block px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider mb-5"
            style={{ background: "rgba(167,139,250,0.12)", color: "#5B21B6", border: "1px solid rgba(167,139,250,0.3)" }}
          >
            🖼️ Gallery
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-4xl md:text-6xl font-bold text-gray-900 mb-4"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            Beauty <span className="text-gradient">Gallery</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-gray-400 text-lg"
          >
            A glimpse into the Magic Lips world
          </motion.p>
        </div>
      </section>

      <section ref={ref} className="pb-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {media.map((item, i) => (
              <motion.div
                key={item._id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={inView ? { opacity: 1, scale: 1 } : {}}
                transition={{ delay: i * 0.05 }}
                className="group aspect-square rounded-2xl overflow-hidden relative border border-purple-100 shadow-sm hover:shadow-lg hover:border-purple-200 transition-all cursor-pointer"
              >
                {item.url && item.type === "video" ? (
                  <video src={item.url} className="w-full h-full object-cover" muted loop playsInline />
                ) : item.url ? (
                  <Image
                    src={item.url}
                    alt={item.title || "Gallery"}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                    sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  />
                ) : null}

                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                  <p className="text-white font-medium text-sm">{item.title}</p>
                </div>

                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 pointer-events-none" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
