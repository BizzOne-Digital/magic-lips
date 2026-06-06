"use client";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import Image from "next/image";
import Link from "next/link";
import Sparkles from "@/components/ui/Sparkles";
import { Heart, Leaf, Sparkles as SparklesIcon, MapPin, ShoppingBag, Mail } from "lucide-react";

const values = [
  { emoji: "💄", title: "Premium Quality", description: "Every product is carefully formulated for the best gloss and wear." },
  { emoji: "🌿", title: "Cruelty Free", description: "100% cruelty-free and vegan. Beauty without harm." },
  { emoji: "✨", title: "Magic Formula", description: "Our unique formula delivers unmatched shine and long-lasting wear." },
  { emoji: "💖", title: "Made with Love", description: "Crafted with passion for every bold, gorgeous beauty lover." },
  { emoji: "🎨", title: "Bold Colors", description: "From classic nudes to vibrant pops — express yourself." },
  { emoji: "🇨🇦", title: "Canadian Brand", description: "Proudly based in York, Ontario. Made for Canadians." },
];

const stats = [
  { value: "500+", label: "Happy Customers", icon: Heart },
  { value: "100%", label: "Cruelty Free", icon: Leaf },
  { value: "York, ON", label: "Canadian Made", icon: MapPin },
];

export default function AboutContent() {
  const { ref: storyRef, inView: storyInView } = useInView({ triggerOnce: true, threshold: 0.1 });
  const { ref: valuesRef, inView: valuesInView } = useInView({ triggerOnce: true, threshold: 0.08 });

  return (
    <div className="min-h-screen" style={{ background: "linear-gradient(180deg, #faf8ff 0%, #ffffff 50%, #f0f9ff 100%)" }}>

      {/* Hero */}
      <section className="relative pt-12 pb-16 sm:pt-16 sm:pb-20 md:pt-24 md:pb-28 overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(196,181,253,0.35) 0%, transparent 70%)" }}
        />
        <Sparkles count={18} />

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 120, damping: 14 }}
            className="relative mx-auto mb-8 w-fit"
          >
            <div
              className="absolute inset-0 rounded-full blur-3xl opacity-50"
              style={{ background: "linear-gradient(135deg, #C4B5FD, #BAE6FD)" }}
            />
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              className="relative"
            >
              <Image
                src="/logo.png"
                alt="Magic Lips"
                width={200}
                height={200}
                className="object-contain drop-shadow-[0_12px_40px_rgba(124,58,237,0.35)]"
                priority
                onError={(e) => { (e.target as HTMLImageElement).src = "/logo.svg"; }}
              />
            </motion.div>
          </motion.div>

          <motion.span
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="inline-block px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider mb-6"
            style={{ background: "rgba(167,139,250,0.12)", color: "#5B21B6", border: "1px solid rgba(167,139,250,0.3)" }}
          >
            ✦ Our Story
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="text-3xl sm:text-4xl md:text-6xl font-bold text-gray-900 mb-5"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            About <span className="text-gradient">Magic Lips</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="text-lg md:text-xl text-gray-500 max-w-2xl mx-auto leading-relaxed"
          >
            Bold, glamorous, magical beauty for every look. We believe every person deserves lips that sparkle and shine.
          </motion.p>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.45 }}
            className="mt-4 text-base font-semibold"
            style={{
              fontFamily: "var(--font-dancing)",
              backgroundImage: "linear-gradient(135deg, #5B21B6, #0EA5E9)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            Gloss. Shine. Magic.
          </motion.p>
        </div>
      </section>

      {/* Stats strip */}
      <section className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 -mt-4 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-4"
        >
          {stats.map(({ value, label, icon: Icon }) => (
            <div
              key={label}
              className="flex items-center gap-4 p-5 rounded-2xl bg-white border border-purple-50 shadow-sm"
            >
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: "linear-gradient(135deg, rgba(196,181,253,0.3), rgba(186,230,253,0.3))" }}
              >
                <Icon className="w-5 h-5 text-purple-700" />
              </div>
              <div>
                <p className="text-lg font-bold text-gray-900">{value}</p>
                <p className="text-xs text-gray-400">{label}</p>
              </div>
            </div>
          ))}
        </motion.div>
      </section>

      {/* Story */}
      <section ref={storyRef} className="py-20 md:py-28">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">

            {/* Circle visual — matches homepage About section */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              animate={storyInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8 }}
              className="relative flex justify-center order-2 lg:order-1"
            >
              <div
                className="relative w-64 h-64 sm:w-80 sm:h-80 md:w-96 md:h-96 rounded-full flex items-center justify-center"
                style={{
                  background: "linear-gradient(135deg, rgba(196,181,253,0.15), rgba(186,230,253,0.15))",
                  border: "2px solid rgba(196,181,253,0.25)",
                }}
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-0 rounded-full"
                  style={{ border: "2px dashed rgba(196,181,253,0.3)" }}
                />
                <motion.div
                  animate={{ y: [0, -12, 0] }}
                  transition={{ duration: 5, repeat: Infinity }}
                  className="relative z-10 w-[72%] h-[72%] rounded-2xl overflow-hidden"
                  style={{ filter: "drop-shadow(0 12px 32px rgba(167,139,250,0.45))" }}
                >
                  <Image
                    src="/images/about-circle.png"
                    alt="Magic Lips — Gloss. Shine. Magic."
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 230px, 276px"
                  />
                </motion.div>
                {["💄", "✨", "💖", "🌟"].map((e, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-10 h-10 rounded-full bg-white shadow-sm border border-purple-100 flex items-center justify-center text-base"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 12 + i * 4, repeat: Infinity, ease: "linear" }}
                    style={{
                      top: `${50 - 46 * Math.cos((i * 90 * Math.PI) / 180)}%`,
                      left: `${50 + 46 * Math.sin((i * 90 * Math.PI) / 180)}%`,
                      transform: "translate(-50%,-50%)",
                    }}
                  >
                    {e}
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Story text */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={storyInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8 }}
              className="order-1 lg:order-2"
            >
              <span className="text-purple-600 text-sm font-semibold uppercase tracking-wider mb-4 block">
                Born from a Love of Beautiful Lips
              </span>
              <h2
                className="text-3xl md:text-4xl font-bold text-gray-900 mb-6"
                style={{ fontFamily: "var(--font-playfair)" }}
              >
                The <span className="text-gradient">Magic Lips</span> Story
              </h2>
              <p className="text-gray-500 leading-relaxed mb-4">
                Magic Lips started with a simple belief: everyone deserves to feel glamorous. Our founder Junie created the brand from a deep passion for bold beauty and the transformative power of a perfect lip gloss.
              </p>
              <p className="text-gray-500 leading-relaxed mb-4">
                Based in York, Ontario, we hand-select every product to ensure the highest quality — from our high-shine glosses to precision liners and adorable keychain accessories.
              </p>
              <p className="text-gray-400 leading-relaxed mb-8 text-sm">
                Whether you&apos;re going for a subtle everyday shine or a bold dramatic statement, Magic Lips has exactly what you need to make your lips unforgettable.
              </p>
              <div className="flex gap-3 flex-wrap">
                <Link href="/shop" className="btn-primary px-8 py-3 text-sm inline-flex items-center gap-2">
                  <ShoppingBag className="w-4 h-4" />
                  Shop Collection
                </Link>
                <Link href="/contact" className="btn-secondary px-8 py-3 text-sm inline-flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  Contact Junie
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Founder card */}
      <section className="pb-20 md:pb-28">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="relative rounded-3xl overflow-hidden p-6 sm:p-8 md:p-12 text-center"
            style={{
              background: "linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(237,233,254,0.6) 100%)",
              border: "1px solid rgba(196,181,253,0.35)",
              boxShadow: "0 20px 60px rgba(124,58,237,0.1)",
            }}
          >
            <div
              className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-32 blur-3xl opacity-40 pointer-events-none"
              style={{ background: "linear-gradient(135deg, #C4B5FD, #BAE6FD)" }}
            />
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
              className="relative mx-auto mb-6 w-fit"
            >
              <Image
                src="/logo.png"
                alt="Magic Lips"
                width={140}
                height={140}
                className="object-contain drop-shadow-[0_8px_24px_rgba(167,139,250,0.4)]"
                onError={(e) => { (e.target as HTMLImageElement).src = "/logo.svg"; }}
              />
            </motion.div>
            <h3
              className="text-3xl font-bold text-gray-900 mb-1 relative"
              style={{ fontFamily: "var(--font-dancing)" }}
            >
              Junie
            </h3>
            <p className="text-purple-600 text-sm font-semibold mb-4">Founder & Beauty Expert</p>
            <p
              className="text-gray-500 text-base italic max-w-md mx-auto"
              style={{ fontFamily: "var(--font-playfair)" }}
            >
              &ldquo;Every lip deserves to shine with magic.&rdquo;
            </p>
          </motion.div>
        </div>
      </section>

      {/* Values */}
      <section ref={valuesRef} className="py-20 md:py-24" style={{ background: "linear-gradient(180deg, #f0f9ff 0%, #faf8ff 100%)" }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={valuesInView ? { opacity: 1, y: 0 } : {}}
            className="text-center mb-12"
          >
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider mb-4"
              style={{ background: "rgba(167,139,250,0.12)", color: "#5B21B6", border: "1px solid rgba(167,139,250,0.3)" }}>
              <SparklesIcon className="w-3.5 h-3.5" />
              What We Stand For
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900" style={{ fontFamily: "var(--font-playfair)" }}>
              Our <span className="text-gradient">Values</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {values.map((v, i) => (
              <motion.div
                key={v.title}
                initial={{ opacity: 0, y: 24 }}
                animate={valuesInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: i * 0.08, duration: 0.6 }}
                className="group p-6 rounded-2xl bg-white border border-purple-50 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300"
              >
                <span className="text-3xl block mb-4 group-hover:scale-110 transition-transform duration-300 inline-block">{v.emoji}</span>
                <h3 className="text-gray-900 font-semibold mb-2">{v.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{v.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 md:py-24">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="rounded-3xl p-8 sm:p-10 md:p-14 relative overflow-hidden"
            style={{
              background: "linear-gradient(135deg, #4C1D95 0%, #6D28D9 50%, #0284C7 100%)",
              boxShadow: "0 24px 60px rgba(76,29,149,0.35)",
            }}
          >
            <Sparkles count={12} />
            <div className="relative z-10">
              <Image
                src="/logo.png"
                alt="Magic Lips"
                width={80}
                height={80}
                className="mx-auto mb-6 object-contain opacity-95"
                onError={(e) => { (e.target as HTMLImageElement).src = "/logo.svg"; }}
              />
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-3" style={{ fontFamily: "var(--font-playfair)" }}>
                Ready for Your Magic Moment?
              </h2>
              <p className="text-white/75 mb-8 text-sm md:text-base max-w-md mx-auto">
                Explore our glosses, liners, keychain accessories, and bundles — crafted for bold, confident beauty lovers everywhere.
              </p>
              <div className="flex gap-3 justify-center flex-wrap">
                <Link
                  href="/shop"
                  className="inline-flex items-center gap-2 px-8 py-3 rounded-full font-semibold text-sm text-purple-900 bg-white hover:bg-purple-50 transition-all hover:-translate-y-0.5 shadow-lg"
                >
                  <ShoppingBag className="w-4 h-4" />
                  Shop Now
                </Link>
                <Link
                  href="/gallery"
                  className="inline-flex items-center gap-2 px-8 py-3 rounded-full font-semibold text-sm text-white border border-white/40 hover:bg-white/10 transition-all"
                >
                  View Gallery
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
