"use client";
import ContactSection from "@/components/home/ContactSection";
import { motion } from "framer-motion";
import Sparkles from "@/components/ui/Sparkles";

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#07051A] to-[#0F0A2E]">
      <section className="relative py-16 sm:py-24 md:py-28 overflow-hidden">
        <Sparkles count={15} />
        <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at center, rgba(124,58,237,0.2) 0%, transparent 70%)" }} />
        <div className="relative z-10 text-center px-4 sm:px-6">
          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 px-2" style={{ fontFamily: "var(--font-playfair)" }}>
            Get In <span className="text-gradient">Touch</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="text-white/50 text-lg">
            We&apos;d love to hear from you. Say hi to Junie! 💄
          </motion.p>
        </div>
      </section>
      <ContactSection />
    </div>
  );
}
