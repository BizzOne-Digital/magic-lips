"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { ArrowRight } from "lucide-react";
import { resolveGalleryMedia, toStaticGallery, type GalleryMediaItem } from "@/lib/galleryImages";

const PREVIEW_COUNT = 6;

export default function GalleryPreview() {
  const [items, setItems] = useState<GalleryMediaItem[]>(() => toStaticGallery(PREVIEW_COUNT));
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });

  useEffect(() => {
    fetch("/api/gallery")
      .then((r) => r.json())
      .then((d) => setItems(resolveGalleryMedia(d.media, PREVIEW_COUNT)))
      .catch(() => setItems(toStaticGallery(PREVIEW_COUNT)));
  }, []);

  return (
    <section
      ref={ref}
      className="py-16 sm:py-20 md:py-24"
      style={{ background: "linear-gradient(135deg, #faf8ff 0%, #f0f9ff 100%)" }}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-12"
        >
          <span
            className="inline-block px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider mb-5"
            style={{ background: "rgba(167,139,250,0.12)", color: "#5B21B6", border: "1px solid rgba(167,139,250,0.3)" }}
          >
            🖼️ Gallery
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-3" style={{ fontFamily: "var(--font-playfair)" }}>
            Beauty <span className="text-gradient">Gallery</span>
          </h2>
          <p className="text-gray-400">A glimpse into the Magic Lips world</p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-10">
          {items.map((item, i) => (
            <Link key={item._id} href="/gallery">
              <motion.div
                initial={{ opacity: 0, scale: 0.93 }}
                animate={inView ? { opacity: 1, scale: 1 } : {}}
                transition={{ delay: i * 0.08, duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
                className="group aspect-square rounded-2xl overflow-hidden relative cursor-pointer border border-purple-100/60 shadow-sm hover:shadow-lg transition-shadow"
              >
                {item.url ? (
                  <Image
                    src={item.url}
                    alt={item.title || "Gallery"}
                    fill
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                    sizes="(max-width: 768px) 50vw, 33vw"
                  />
                ) : null}

                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                  <p className="text-white font-medium text-sm translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                    {item.title}
                  </p>
                </div>

                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out pointer-events-none" />
              </motion.div>
            </Link>
          ))}
        </div>

        <div className="text-center">
          <Link href="/gallery" className="btn-secondary px-10 gap-2">
            View Full Gallery <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
