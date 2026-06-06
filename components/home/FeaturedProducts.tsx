"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { ArrowRight } from "lucide-react";
import ShowcaseCard from "@/components/ui/ShowcaseCard";

interface Product {
  _id: string;
  name: string;
  slug: string;
  price: number;
  originalPrice?: number;
  images: string[];
  description: string;
  isFeatured: boolean;
  isBundle?: boolean;
  category: { name: string };
}

const categoryFallbackBySlug: Record<string, string> = {
  "magic-lip-gloss": "/images/category-gloss.png",
  "magic-lip-liner": "/images/category-liner.png",
  "labubu-keychain-gloss": "/images/category-keychain.png",
  "gloss-liner-bundle": "/images/category-bundles.png",
};

const featuredImagesBySlug: Record<string, string> = {
  "magic-lip-gloss": "/images/featured-gloss.png",
  "magic-lip-liner": "/images/featured-liner.png",
  "labubu-keychain-gloss": "/images/featured-keychain.png",
  "gloss-liner-bundle": "/images/featured-bundle.png",
};

const accentsBySlug: Record<string, string> = {
  "magic-lip-gloss": "#4C1D95",
  "magic-lip-liner": "#0284C7",
  "labubu-keychain-gloss": "#DB2777",
  "gloss-liner-bundle": "#D97706",
};

const longDescriptions: Record<string, string> = {
  "magic-lip-gloss":
    "High-shine lip gloss for a bold glossy finish that catches the light beautifully. Smooth, non-sticky formula for everyday glamour and special occasions alike.",
  "magic-lip-liner":
    "Smooth lip liner to shape and define lips with precision and confidence. Creates clean edges and long-lasting colour that stays put from morning to night.",
  "labubu-keychain-gloss":
    "Cute keychain gloss with a playful beauty vibe — clip it to your bag and shine on the go. Portable, adorable, and always ready for a touch-up.",
  "gloss-liner-bundle":
    "Buy lip gloss and liner together for the ultimate lip duo at a special bundle price. Everything you need for a bold, glossy, perfectly defined look.",
};

function getProductImage(product: Product): string {
  return featuredImagesBySlug[product.slug] || product.images?.[0] || categoryFallbackBySlug[product.slug] || "/images/category-gloss.png";
}

function getAccent(product: Product): string {
  return accentsBySlug[product.slug] || "#4C1D95";
}

function getDescription(product: Product): string {
  return longDescriptions[product.slug] || product.description;
}

const fallback: Product[] = [
  { _id: "1", name: "Magic Lip Gloss", slug: "magic-lip-gloss", price: 12, images: ["/images/featured-gloss.png"], description: "High-shine lip gloss for a bold glossy finish.", isFeatured: true, category: { name: "Gloss" } },
  { _id: "2", name: "Magic Lip Liner", slug: "magic-lip-liner", price: 8, images: ["/images/featured-liner.png"], description: "Smooth lip liner to shape and define lips.", isFeatured: true, category: { name: "Liner" } },
  { _id: "3", name: "Labubu Keychain Gloss", slug: "labubu-keychain-gloss", price: 15, images: ["/images/featured-keychain.png"], description: "Cute keychain gloss with a playful beauty vibe.", isFeatured: true, category: { name: "Keychain Gloss" } },
  { _id: "4", name: "Gloss + Liner Bundle", slug: "gloss-liner-bundle", price: 17, originalPrice: 20, images: ["/images/featured-bundle.png"], description: "Buy lip gloss and liner — liner for only $5.", isFeatured: true, isBundle: true, category: { name: "Gloss" } },
];

export default function FeaturedProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });

  useEffect(() => {
    fetch("/api/products?featured=true&limit=4")
      .then((r) => r.json())
      .then((d) => { setProducts(d.products?.length ? d.products : fallback); setLoading(false); })
      .catch(() => { setProducts(fallback); setLoading(false); });
  }, []);

  return (
    <section className="relative py-16 sm:py-20 md:py-24 bg-white" id="featured">
      <div ref={ref} className="max-w-7xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-14"
        >
          <span
            className="inline-block px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider mb-5"
            style={{ background: "rgba(167,139,250,0.12)", color: "#5B21B6", border: "1px solid rgba(167,139,250,0.3)" }}
          >
            ✦ Best Sellers
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-3" style={{ fontFamily: "var(--font-playfair)" }}>
            Featured <span className="text-gradient">Collection</span>
          </h2>
          <p className="text-gray-500 max-w-md mx-auto">
            Our most-loved lip essentials — bold, glossy, and made for every look.
          </p>
        </motion.div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="min-h-[480px] rounded-3xl bg-gray-100 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {products.map((p, i) => (
              <motion.div
                key={p._id}
                initial={{ opacity: 0, y: 32 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.65, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
              >
                <ShowcaseCard
                  href={`/shop/${p.slug}`}
                  image={getProductImage(p)}
                  title={p.name}
                  description={getDescription(p)}
                  accent={getAccent(p)}
                  onImageError={(e) => {
                    const img = e.target as HTMLImageElement;
                    const fallback = categoryFallbackBySlug[p.slug];
                    if (fallback && !img.src.includes(fallback)) img.src = fallback;
                  }}
                  badges={
                    <>
                      {p.isBundle && (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-400 text-white shadow-sm">
                          Bundle Deal
                        </span>
                      )}
                      {p.originalPrice && p.originalPrice > p.price && (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-400 text-white shadow-sm">
                          Save ${(p.originalPrice - p.price).toFixed(0)}
                        </span>
                      )}
                    </>
                  }
                />
              </motion.div>
            ))}
          </div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.55 }}
          className="text-center mt-12"
        >
          <Link href="/shop" className="btn-secondary px-10 py-3 gap-2">
            View All Products <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
