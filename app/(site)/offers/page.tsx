"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import Sparkles from "@/components/ui/Sparkles";
import NewsletterSection from "@/components/home/NewsletterSection";

const offers = [
  {
    emoji: "💌",
    badge: "New Subscribers Only",
    title: "10% Off Your First Order",
    description: "Subscribe to our newsletter and get an exclusive 10% discount code for your very first order at Magic Lips.",
    details: ["Valid on all products", "One-time use per subscriber", "No minimum purchase required"],
    cta: "Subscribe & Get Code",
    link: "#newsletter",
    gradient: "from-purple-900/60 to-pink-900/60",
    border: "border-pink-500/30",
  },
  {
    emoji: "💄✏️",
    badge: "Bundle & Save",
    title: "Gloss + Liner Bundle Deal",
    description: "Buy our Magic Lip Gloss ($12) and get a Lip Liner for just $5! That's a saving of $3 off the regular liner price.",
    details: ["Lip Gloss at regular $12 price", "Lip Liner discounted to just $5", "Perfect complete lip look"],
    cta: "Shop Bundle",
    link: "/shop",
    gradient: "from-yellow-900/60 to-purple-900/60",
    border: "border-yellow-500/30",
  },
  {
    emoji: "🚚",
    badge: "Shipping Offer",
    title: "Free Shipping on Orders $30+",
    description: "Add a few more products to your cart and enjoy free shipping across Canada on orders over $30.",
    details: ["Available across Canada", "No code needed — auto-applied", "Fast and reliable delivery"],
    cta: "Shop Now",
    link: "/shop",
    gradient: "from-blue-900/60 to-purple-900/60",
    border: "border-blue-500/30",
  },
];

export default function OffersPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#07051A] to-[#0F0A2E]">
      {/* Hero */}
      <section className="relative py-16 sm:py-24 md:py-28 overflow-hidden">
        <Sparkles count={25} />
        <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at center, rgba(245,158,11,0.2) 0%, transparent 70%)" }} />
        <div className="relative z-10 text-center px-4 sm:px-6">
          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 px-2" style={{ fontFamily: "var(--font-playfair)" }}>
            Hot <span className="text-gradient-gold">Offers</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="text-white/50 text-lg">
            Exclusive deals and discounts just for you ✨
          </motion.p>
        </div>
      </section>

      {/* Offers */}
      <section className="pb-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 space-y-6 sm:space-y-8">
          {offers.map((offer, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.15 }}>
              <div className={`rounded-3xl p-5 sm:p-8 border ${offer.border} bg-gradient-to-br ${offer.gradient} backdrop-blur-xl`}>
                <div className="flex flex-col md:flex-row gap-8 items-center">
                  <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 3 + i, repeat: Infinity }} className="text-6xl flex-shrink-0">
                    {offer.emoji}
                  </motion.div>
                  <div className="flex-1">
                    <span className="text-xs font-bold uppercase tracking-wider text-purple-400 block mb-2">{offer.badge}</span>
                    <h2 className="text-2xl font-bold text-white mb-3" style={{ fontFamily: "var(--font-playfair)" }}>{offer.title}</h2>
                    <p className="text-white/60 mb-4">{offer.description}</p>
                    <ul className="space-y-1 mb-6">
                      {offer.details.map((d) => (
                        <li key={d} className="flex items-center gap-2 text-white/50 text-sm">
                          <span className="text-green-400">✓</span> {d}
                        </li>
                      ))}
                    </ul>
                    <Link href={offer.link} className="btn-primary text-sm px-8">
                      {offer.cta} →
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Newsletter */}
      <NewsletterSection />
    </div>
  );
}
