"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { MapPin, Phone, Mail } from "lucide-react";
import toast from "react-hot-toast";

/* ── Animated moving line at top ──────────────────────────────────────── */
function MovingLine() {
  return (
    <div className="relative w-full h-[3px] overflow-hidden">
      {/* Static base */}
      <div className="absolute inset-0" style={{ background: "rgba(255,255,255,0.04)" }} />
      {/* Moving shimmer — loops left to right */}
      <motion.div
        className="absolute top-0 left-0 h-full w-[200px]"
        style={{
          background:
            "linear-gradient(90deg, transparent 0%, #C4B5FD 30%, #ffffff 50%, #7DD3FC 70%, transparent 100%)",
        }}
        animate={{ left: ["-200px", "100%"] }}
        transition={{ duration: 3.2, repeat: Infinity, ease: "linear", repeatDelay: 0.8 }}
      />
    </div>
  );
}

/* ── TikTok icon ──────────────────────────────────────────────────────── */
function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.27 6.27 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.2 8.2 0 0 0 4.78 1.52V6.79a4.85 4.85 0 0 1-1.01-.1z" />
    </svg>
  );
}

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}

/* ── Dark info card ───────────────────────────────────────────────────── */
function InfoCard({
  label,
  children,
  delay = 0,
}: {
  label: string;
  children: React.ReactNode;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay }}
      className="rounded-2xl p-5 sm:p-6 flex-1"
      style={{
        background: "rgba(255,255,255,0.05)",
        border: "1px solid rgba(255,255,255,0.08)",
      }}
    >
      <p
        className="text-[10px] font-bold uppercase tracking-[0.18em] mb-4"
        style={{ color: "rgba(196,181,253,0.7)" }}
      >
        {label}
      </p>
      {children}
    </motion.div>
  );
}

/* ── Main Footer ──────────────────────────────────────────────────────── */
export default function Footer() {
  const [email, setEmail] = useState("");

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (res.ok || data.code) {
        toast.success(`Subscribed! Your code: ${data.code || "MAGIC10"} ✨`);
        setEmail("");
      } else {
        toast.error(data.error || "Already subscribed");
      }
    } catch {
      toast.error("Could not subscribe. Try again.");
    }
  };

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/shop", label: "Shop" },
    { href: "/offers", label: "Offers" },
    { href: "/about", label: "About Us" },
    { href: "/gallery", label: "Gallery" },
    { href: "/contact", label: "Contact" },
  ];

  return (
    <footer
      className="relative overflow-hidden"
      style={{ background: "linear-gradient(170deg, #12092b 0%, #0e0620 60%, #0a0418 100%)" }}
    >
      {/* ── Animated moving line at very top ── */}
      <MovingLine />

      {/* Subtle background glow */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 pointer-events-none"
        style={{
          width: "800px",
          height: "300px",
          background:
            "radial-gradient(ellipse at center, rgba(124,58,237,0.12) 0%, transparent 70%)",
        }}
      />

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6">

        {/* ── Tagline row ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center py-10 sm:py-12 border-b"
          style={{ borderColor: "rgba(255,255,255,0.06)" }}
        >
          <h2
            className="text-xl sm:text-2xl md:text-3xl font-semibold text-white/80 px-2"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            Your premier destination for premium lip beauty
          </h2>
        </motion.div>

        {/* ── Three info cards ── */}
        <div className="flex flex-col md:flex-row gap-5 py-10 border-b" style={{ borderColor: "rgba(255,255,255,0.06)" }}>

          {/* Contact Us card */}
          <InfoCard label="Contact Us" delay={0}>
            <div className="space-y-4">
              <a
                href="tel:+16474950299"
                className="flex items-center gap-3 group"
              >
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ background: "rgba(124,58,237,0.25)", border: "1px solid rgba(124,58,237,0.35)" }}
                >
                  <Phone className="w-3.5 h-3.5 text-violet-300" />
                </div>
                <span className="text-white/65 text-sm group-hover:text-white/90 transition-colors">
                  +1 647 495 0299
                </span>
              </a>
              <a
                href="mailto:magiclips2013@gmail.com"
                className="flex items-center gap-3 group"
              >
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ background: "rgba(124,58,237,0.25)", border: "1px solid rgba(124,58,237,0.35)" }}
                >
                  <Mail className="w-3.5 h-3.5 text-violet-300" />
                </div>
                <span className="text-white/65 text-sm group-hover:text-white/90 transition-colors break-all">
                  magiclips2013@gmail.com
                </span>
              </a>
            </div>
          </InfoCard>

          {/* Location card */}
          <InfoCard label="Visit Us" delay={0.1}>
            <div className="flex items-start gap-3">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
                style={{ background: "rgba(124,58,237,0.25)", border: "1px solid rgba(124,58,237,0.35)" }}
              >
                <MapPin className="w-3.5 h-3.5 text-violet-300" />
              </div>
              <div>
                <p className="text-white/85 font-semibold text-sm mb-1">York — Ontario</p>
                <p className="text-white/50 text-sm leading-relaxed">
                  3735 Dundas St W<br />
                  York, ON M6S 2T6<br />
                  Canada
                </p>
              </div>
            </div>
          </InfoCard>

          {/* Newsletter card */}
          <InfoCard label="Get 10% Off" delay={0.2}>
            <p className="text-white/45 text-xs mb-4 leading-relaxed">
              Subscribe to our beauty list and get an exclusive 10% discount code for your first order.
            </p>
            <form onSubmit={handleSubscribe} className="space-y-2">
              <input
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl text-sm text-white placeholder-white/25 focus:outline-none transition-all"
                style={{
                  background: "rgba(255,255,255,0.06)",
                  border: "1px solid rgba(255,255,255,0.1)",
                }}
                onFocus={(e) => { (e.target as HTMLInputElement).style.borderColor = "rgba(124,58,237,0.5)"; }}
                onBlur={(e)  => { (e.target as HTMLInputElement).style.borderColor = "rgba(255,255,255,0.1)"; }}
                required
              />
              <button
                type="submit"
                className="w-full py-2.5 rounded-xl text-xs font-bold text-white transition-all hover:opacity-90"
                style={{ background: "linear-gradient(135deg, #4C1D95, #6D28D9)" }}
              >
                Subscribe & Save ✨
              </button>
            </form>
          </InfoCard>
        </div>

        {/* ── Social icons row ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.25 }}
          className="flex justify-center gap-4 py-8 border-b"
          style={{ borderColor: "rgba(255,255,255,0.06)" }}
        >
          <a
            href="https://instagram.com/magiclips2013"
            target="_blank"
            rel="noopener noreferrer"
            className="w-11 h-11 rounded-full flex items-center justify-center transition-all hover:scale-110"
            style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }}
            onMouseEnter={(e) => {
              const el = e.currentTarget as HTMLElement;
              el.style.background = "rgba(251,207,232,0.15)";
              el.style.borderColor = "rgba(251,207,232,0.4)";
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget as HTMLElement;
              el.style.background = "rgba(255,255,255,0.06)";
              el.style.borderColor = "rgba(255,255,255,0.1)";
            }}
          >
            <InstagramIcon className="w-5 h-5 text-white/55" />
          </a>
          <a
            href="https://tiktok.com/@magiclips02"
            target="_blank"
            rel="noopener noreferrer"
            className="w-11 h-11 rounded-full flex items-center justify-center transition-all hover:scale-110"
            style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }}
            onMouseEnter={(e) => {
              const el = e.currentTarget as HTMLElement;
              el.style.background = "rgba(196,181,253,0.15)";
              el.style.borderColor = "rgba(196,181,253,0.4)";
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget as HTMLElement;
              el.style.background = "rgba(255,255,255,0.06)";
              el.style.borderColor = "rgba(255,255,255,0.1)";
            }}
          >
            <TikTokIcon className="w-5 h-5 text-white/55" />
          </a>
        </motion.div>

        {/* ── Navigation links row ── */}
        <motion.nav
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="flex flex-wrap justify-center gap-x-4 sm:gap-x-8 gap-y-3 py-7 border-b"
          style={{ borderColor: "rgba(255,255,255,0.06)" }}
        >
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-white/45 hover:text-white/85 text-sm transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </motion.nav>

        {/* ── Bottom bar: copyright · logo · credit ── */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 sm:gap-5 py-6 sm:py-8 text-center md:text-left">

          <p className="text-white/25 text-xs order-2 md:order-1">
            © {new Date().getFullYear()} Magic Lips. All rights reserved.
          </p>

          {/* Centred logo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="flex flex-col items-center gap-1 order-1 md:order-2"
          >
            <Image
              src="/logo.png"
              alt="Magic Lips"
              width={56}
              height={56}
              className="object-contain"
              style={{ filter: "drop-shadow(0 0 12px rgba(167,139,250,0.5))" }}
              onError={(e) => { (e.target as HTMLImageElement).src = "/logo.svg"; }}
            />
            <span
              className="text-lg font-bold"
              style={{
                fontFamily: "var(--font-dancing)",
                backgroundImage: "linear-gradient(135deg, #C4B5FD, #93C5FD)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Magic Lips
            </span>
          </motion.div>

          <div className="flex items-center gap-4 order-3 text-xs text-white/20">
            <Link href="/admin/login" className="hover:text-white/45 transition-colors">
              Admin
            </Link>
            <span>·</span>
            <span>Made with ✨ love</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
