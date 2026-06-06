"use client";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import Image from "next/image";
import Link from "next/link";

const features = [
  { emoji: "💄", title: "Premium Formula",   desc: "Long-lasting, high-shine gloss that stays all day"   },
  { emoji: "🌿", title: "Cruelty Free",      desc: "100% cruelty-free and vegan-friendly beauty"         },
  { emoji: "✨", title: "Magical Shine",     desc: "Stunning shimmer for every occasion"                 },
  { emoji: "💖", title: "Made with Love",    desc: "Crafted for bold, confident beauty lovers everywhere" },
];

export default function AboutSection() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <section
      ref={ref}
      className="py-16 sm:py-24"
      style={{ background: "linear-gradient(135deg, #faf8ff 0%, #f0f9ff 100%)" }}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          {/* Visual */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="relative flex justify-center"
          >
            <div
              className="relative w-[min(100%,18rem)] h-[min(100%,18rem)] sm:w-80 sm:h-80 md:w-96 md:h-96 rounded-full flex items-center justify-center mx-auto"
              style={{ background: "linear-gradient(135deg, rgba(196,181,253,0.15), rgba(186,230,253,0.15))", border: "2px solid rgba(196,181,253,0.25)" }}
            >
              {/* Rotating ring */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 rounded-full"
                style={{ border: "2px dashed rgba(196,181,253,0.3)" }}
              />

              {/* Center */}
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
                  priority
                />
              </motion.div>

              {/* Orbiting badges */}
              {["💄","✨","💖","🌟"].map((e, i) => (
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

          {/* Text */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
            <span className="inline-block px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider mb-6"
              style={{ background: "rgba(167,139,250,0.12)", color: "#5B21B6", border: "1px solid rgba(167,139,250,0.3)" }}>
              ✦ Our Story
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-5" style={{ fontFamily: "var(--font-playfair)" }}>
              About <span className="text-gradient">Magic Lips</span>
            </h2>
            <p className="text-gray-500 leading-relaxed mb-4">
              Magic Lips was born from a love of bold, glamorous beauty. We believe every person deserves lips that shine, sparkle, and turn heads — no matter the occasion.
            </p>
            <p className="text-gray-400 leading-relaxed mb-8 text-sm">
              From our high-shine lip glosses to precision lip liners and adorable keychain accessories — every product is crafted for the beauty lover who wants more magic in their look.
            </p>

            {/* Features */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
              {features.map((f, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 16 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 0.3 + i * 0.08 }}
                  className="flex items-start gap-3 p-4 rounded-xl bg-white border border-purple-50 shadow-sm"
                >
                  <span className="text-xl flex-shrink-0">{f.emoji}</span>
                  <div>
                    <p className="text-gray-800 font-semibold text-sm">{f.title}</p>
                    <p className="text-gray-400 text-xs mt-0.5">{f.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="flex gap-3 flex-wrap">
              <Link href="/about"   className="btn-primary  px-8 py-3 text-sm">Learn More</Link>
              <Link href="/contact" className="btn-secondary px-8 py-3 text-sm">Contact Junie</Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
