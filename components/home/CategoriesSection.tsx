"use client";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import ShowcaseCard from "@/components/ui/ShowcaseCard";

const categories = [
  {
    name: "Lip Gloss",
    slug: "gloss",
    image: "/images/category-gloss.png",
    accent: "#4C1D95",
    description:
      "Discover high-shine lip glosses that deliver bold colour, mirror-like finish, and all-day glamour for every look. Our gloss collection is crafted for shine that turns heads.",
  },
  {
    name: "Lip Liners",
    slug: "liner",
    image: "/images/category-liner.png",
    accent: "#0284C7",
    description:
      "Define and shape your lips with smooth, precision lip liners crafted for clean lines and long-lasting wear. Perfect for sculpting a bold, polished pout every time.",
  },
  {
    name: "Keychain Gloss",
    slug: "keychain-gloss",
    image: "/images/category-keychain.png",
    accent: "#DB2777",
    description:
      "Cute, portable keychain gloss you can clip anywhere — touch-ups on the go with playful Magic Lips charm. Beauty that travels with you, wherever life takes you.",
  },
  {
    name: "Bundles",
    slug: "bundles",
    image: "/images/category-bundles.png",
    accent: "#D97706",
    description:
      "Save more when you shop our gloss and liner bundles — the perfect lip duo at a value you'll love. Get the complete Magic Lips look for less.",
  },
];

export default function CategoriesSection() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <section
      ref={ref}
      className="py-16 sm:py-20"
      style={{ background: "linear-gradient(180deg, #faf8ff 0%, #ffffff 100%)" }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-12"
        >
          <h2
            className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-2"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            Shop by <span className="text-gradient">Category</span>
          </h2>
          <p className="text-gray-400 text-sm">Find exactly what your lips need</p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {categories.map((cat, i) => (
            <motion.div
              key={cat.slug}
              initial={{ opacity: 0, y: 32 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.1, duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
            >
              <ShowcaseCard
                href={`/shop?category=${cat.slug}`}
                image={cat.image}
                title={cat.name}
                description={cat.description}
                accent={cat.accent}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
