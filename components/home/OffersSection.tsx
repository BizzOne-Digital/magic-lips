"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

const offers = [
  {
    badge: "Newsletter",
    title: "10% Off First Order",
    description: "Subscribe to our beauty list and receive a 10% discount code instantly for your first order.",
    cta: "Subscribe & Save",
    link: "#newsletter",
    accent: "#4C1D95",
    bg: "from-violet-50 to-purple-50/50",
    border: "border-violet-100",
  },
  {
    badge: "Bundle Deal",
    title: "Gloss + Liner Bundle",
    description: "Buy Magic Lip Gloss ($12) and get a Lip Liner for just $5. The perfect lip duo!",
    cta: "Shop Bundle",
    link: "/shop",
    accent: "#F9A8D4",
    bg: "from-pink-50 to-rose-50/50",
    border: "border-pink-100",
  },
  {
    badge: "Free Shipping",
    title: "Free on Orders $30+",
    description: "Orders over $30 across Canada ship free. Add a little extra and save on delivery!",
    cta: "Shop Now",
    link: "/shop",
    accent: "#7DD3FC",
    bg: "from-sky-50 to-blue-50/50",
    border: "border-sky-100",
  },
];

export default function OffersSection() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <section ref={ref} className="py-16 sm:py-24 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-14"
        >
          <span className="inline-block px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider mb-5"
            style={{ background: "rgba(253,230,138,0.3)", color: "#D97706", border: "1px solid rgba(253,230,138,0.6)" }}>
            🔥 Hot Deals
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-3" style={{ fontFamily: "var(--font-playfair)" }}>
            Exclusive <span className="text-gradient-gold">Offers</span>
          </h2>
          <p className="text-gray-400 max-w-md mx-auto">
            Treat yourself to our best deals — beautiful products at even better prices.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {offers.map((offer, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 32 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.65, delay: i * 0.12, ease: [0.16, 1, 0.3, 1] }}
            >
              <div
                className={`group relative rounded-2xl sm:rounded-3xl p-6 sm:p-8 border bg-gradient-to-br ${offer.bg} ${offer.border} hover:-translate-y-2 transition-all duration-300 ease-out flex flex-col h-full`}
                style={{
                  boxShadow: "0 2px 16px rgba(0,0,0,0.04)",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.boxShadow = `0 12px 40px ${offer.accent}30`;
                  (e.currentTarget as HTMLElement).style.borderColor = `${offer.accent}60`;
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.boxShadow = "0 2px 16px rgba(0,0,0,0.04)";
                  (e.currentTarget as HTMLElement).style.borderColor = "";
                }}
              >
                <span
                  className="text-[10px] font-bold uppercase tracking-widest mb-2 block"
                  style={{ color: offer.accent }}
                >
                  {offer.badge}
                </span>
                <h3 className="text-xl font-bold text-gray-900 mb-3" style={{ fontFamily: "var(--font-playfair)" }}>
                  {offer.title}
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed flex-1 mb-6">
                  {offer.description}
                </p>
                <Link
                  href={offer.link}
                  className="inline-flex items-center gap-1.5 text-sm font-semibold transition-colors"
                  style={{ color: offer.accent }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.opacity = "0.7"; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.opacity = "1"; }}
                >
                  {offer.cta} →
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
