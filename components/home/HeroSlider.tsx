"use client";
import { useState, useEffect, useCallback, useRef, type CSSProperties } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { gsap } from "gsap";

const fallbackSlides = [
  {
    id: 1,
    badge:         "Premium Beauty Collection",
    heading:       "Welcome to",
    headingScript: "Magic Lips",
    sub:           "Gloss that shines, sparkles, and makes every look unforgettable.",
    btn1: { text:"Shop Now",         href:"/shop"          },
    btn2: { text:"Explore",          href:"/about"         },
    emoji: "💄",
    image: "/images/hero-slide-1-welcome.png",
    accent: "#4C1D95",
    bg: "radial-gradient(ellipse at 70% 50%, #ede9fe 0%, #f8f4ff 40%, #eef6fd 100%)",
    orb1: "rgba(76,29,149,0.10)",
    orb2: "rgba(186,230,253,0.25)",
  },
  {
    id: 2,
    badge:         "Exclusive Subscriber Offer",
    heading:       "10% Off Your",
    headingScript: "First Order",
    sub:           "Join our beauty list and get an exclusive discount code instantly.",
    btn1: { text:"Subscribe & Save", href:"/#newsletter"   },
    btn2: { text:"View Offers",      href:"/offers"        },
    emoji: "✨",
    image: "/images/hero-slide-2-offer.png",
    accent: "#1E3A8A",
    bg: "radial-gradient(ellipse at 30% 50%, #dbeafe 0%, #f0f9ff 40%, #fdf4ff 100%)",
    orb1: "rgba(30,58,138,0.10)",
    orb2: "rgba(196,181,253,0.20)",
  },
  {
    id: 3,
    badge:         "Glosses • Liners • Keychain Gloss",
    heading:       "Pretty Lips,",
    headingScript: "Bold Looks",
    sub:           "Lip essentials crafted for bold, glossy, unforgettable looks every day.",
    btn1: { text:"View Products",    href:"/shop"          },
    btn2: { text:"See Gallery",      href:"/gallery"       },
    emoji: "🌸",
    image: "/images/hero-slide-3-collection.png",
    accent: "#581C87",
    bg: "radial-gradient(ellipse at 60% 40%, #fae8ff 0%, #fdf4ff 40%, #f0f9ff 100%)",
    orb1: "rgba(88,28,135,0.10)",
    orb2: "rgba(186,230,253,0.20)",
  },
  {
    id: 4,
    badge:         "Best Value Bundle",
    heading:       "Bundle &",
    headingScript: "Save Big!",
    sub:           "Buy lip gloss and liner together — get the liner for only $5.",
    btn1: { text:"Shop Bundle",      href:"/shop"          },
    btn2: { text:"Learn More",       href:"/offers"        },
    emoji: "🛍️",
    image: "/images/hero-slide-4-bundle.png",
    accent: "#6B21A8",
    bg: "radial-gradient(ellipse at 50% 60%, #fef3c7 0%, #fffbeb 40%, #fdf4ff 100%)",
    orb1: "rgba(107,33,168,0.08)",
    orb2: "rgba(196,181,253,0.2)",
  },
];

interface ApiHeroSlide {
  _id: string;
  heading: string;
  subheading: string;
  buttonText: string;
  buttonLink: string;
  secondaryButtonText?: string;
  secondaryButtonLink?: string;
  image?: string;
  order: number;
}

type DisplaySlide = (typeof fallbackSlides)[number];

function splitHeading(full: string): { heading: string; headingScript: string } {
  const presets: [RegExp, string, string][] = [
    [/welcome to magic lips/i, "Welcome to", "Magic Lips"],
    [/10% off/i, "10% Off Your", "First Order"],
    [/bundle/i, "Bundle &", "Save Big!"],
    [/gloss|liner|keychain/i, "Pretty Lips,", "Bold Looks"],
  ];
  for (const [pattern, heading, headingScript] of presets) {
    if (pattern.test(full)) return { heading, headingScript };
  }
  const words = full.trim().split(/\s+/);
  if (words.length >= 3) {
    return { heading: words.slice(0, -2).join(" "), headingScript: words.slice(-2).join(" ") };
  }
  if (words.length === 2) {
    return { heading: words[0], headingScript: words[1] };
  }
  return { heading: "", headingScript: full };
}

function mergeApiSlides(apiSlides: ApiHeroSlide[]): DisplaySlide[] {
  return apiSlides.map((s, i) => {
    const base = fallbackSlides[i % fallbackSlides.length];
    const { heading, headingScript } = splitHeading(s.heading);
    return {
      ...base,
      id: i + 1,
      heading: heading || s.heading,
      headingScript,
      sub: s.subheading,
      btn1: { text: s.buttonText, href: s.buttonLink },
      btn2: s.secondaryButtonText
        ? { text: s.secondaryButtonText, href: s.secondaryButtonLink || "/" }
        : base.btn2,
      image: s.image || base.image,
    };
  });
}

export default function HeroSlider() {
  const [displaySlides, setDisplaySlides] = useState<DisplaySlide[]>(fallbackSlides);
  const [cur, setCur]   = useState(0);
  const [busy, setBusy] = useState(false);

  // Refs for GSAP
  const headingRef    = useRef<HTMLHeadingElement>(null);
  const scriptRef     = useRef<HTMLSpanElement>(null);
  const subRef        = useRef<HTMLParagraphElement>(null);
  const badgeRef      = useRef<HTMLSpanElement>(null);
  const btnsRef       = useRef<HTMLDivElement>(null);
  const statsRef      = useRef<HTMLDivElement>(null);
  const visualRef     = useRef<HTMLDivElement>(null);

  const animateIn = useCallback(() => {
    const els = [badgeRef.current, headingRef.current, subRef.current, btnsRef.current, statsRef.current];
    gsap.fromTo(els,
      { y: 50, opacity: 0, filter: "blur(8px)" },
      {
        y: 0, opacity: 1, filter: "blur(0px)",
        duration: 0.8,
        stagger: 0.08,
        ease: "power3.out",
        clearProps: "filter",
      }
    );
    // Script heading uses gradient text — never apply filter blur (breaks background-clip)
    gsap.fromTo(scriptRef.current,
      { y: 50, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, delay: 0.16, ease: "power3.out" }
    );
    gsap.fromTo(visualRef.current,
      { x: 60, opacity: 0, scale: 0.9 },
      { x: 0, opacity: 1, scale: 1, duration: 1, ease: "back.out(1.3)", clearProps: "transform" }
    );
  }, []);

  const go = useCallback((newDir: 1 | -1) => {
    if (busy) return;
    setBusy(true);

    // Animate out
    const els = [badgeRef.current, headingRef.current, subRef.current, btnsRef.current, statsRef.current];
    gsap.to(els, {
      y: newDir > 0 ? -40 : 40,
      opacity: 0,
      filter: "blur(6px)",
      duration: 0.4,
      stagger: 0.04,
      ease: "power2.in",
    });
    gsap.to(scriptRef.current, {
      y: newDir > 0 ? -40 : 40,
      opacity: 0,
      duration: 0.4,
      ease: "power2.in",
      onComplete: () => {
        setCur((c) => (c + newDir + displaySlides.length) % displaySlides.length);
        setTimeout(() => { animateIn(); setBusy(false); }, 50);
      },
    });
    gsap.to(visualRef.current, {
      x: newDir > 0 ? -50 : 50,
      opacity: 0,
      scale: 0.9,
      duration: 0.4,
      ease: "power2.in",
    });
  }, [busy, displaySlides.length, animateIn]);

  useEffect(() => {
    fetch("/api/hero-slides")
      .then((r) => r.json())
      .then((d) => {
        if (d.slides?.length) {
          setDisplaySlides(mergeApiSlides(d.slides));
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => { animateIn(); }, []);
  useEffect(() => {
    const t = setInterval(() => go(1), 5800);
    return () => clearInterval(t);
  }, [go]);

  const slide = displaySlides[cur];

  return (
    <section className="relative min-h-[auto] sm:min-h-[90vh] lg:min-h-[95vh] flex items-center overflow-hidden pb-24 sm:pb-20">
      {/* Background — crossfade between slides */}
      <AnimatePresence>
        <motion.div
          key={`bg-${cur}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2 }}
          className="absolute inset-0"
          style={{ background: slide.bg }}
        />
      </AnimatePresence>

      {/* Orb 1 — clipped by section overflow-hidden */}
      <div
        className="absolute pointer-events-none select-none max-w-[100%]"
        style={{
          width: "min(700px, 90vw)", height: "min(700px, 90vw)", borderRadius: "50%",
          top: "50%", left: "50%", transform: "translate(-50%,-50%)",
          background: `radial-gradient(circle, ${slide.orb1} 0%, transparent 70%)`,
          zIndex: 0,
        }}
      />
      {/* Orb 2 */}
      <div
        className="absolute pointer-events-none select-none max-w-[100%]"
        style={{
          width: "min(500px, 70vw)", height: "min(500px, 70vw)", borderRadius: "50%",
          top: "20%", left: "5%",
          background: `radial-gradient(circle, ${slide.orb2} 0%, transparent 70%)`,
          zIndex: 0,
        }}
      />
      {/* Floating sparkles */}
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute pointer-events-none"
          style={{
            left: `${10 + i * 11}%`,
            top:  `${15 + (i % 3) * 25}%`,
          }}
          animate={{
            y:       [0, -20, 0],
            opacity: [0, 0.7, 0],
            scale:   [0.5, 1, 0.5],
            rotate:  [0, 180, 360],
          }}
          transition={{
            duration: 3 + i * 0.4,
            delay:    i * 0.6,
            repeat:   Infinity,
            ease:     "easeInOut",
          }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill={slide.accent} style={{ opacity: 0.5 }}>
            <path d="M12 2L13.5 9.5L21 11L13.5 12.5L12 20L10.5 12.5L3 11L10.5 9.5Z"/>
          </svg>
        </motion.div>
      ))}

      {/* ── Content ── */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-16 w-full">
        <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-16">

          {/* Left: Text */}
          <div className="flex-1 text-center lg:text-left max-w-xl">
            {/* Badge */}
            <span
              ref={badgeRef}
              className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 rounded-full text-[10px] sm:text-xs font-semibold uppercase tracking-wider mb-4 sm:mb-6 max-w-full text-center"
              style={{
                background: `${slide.accent}14`,
                color: slide.accent,
                border: `1px solid ${slide.accent}30`,
              }}
            >
              ✦ {slide.badge}
            </span>

            {/* Main heading */}
            <h1
              ref={headingRef}
              className="font-bold text-gray-900 leading-tight mb-1"
              style={{ fontFamily:"var(--font-playfair)", fontSize:"clamp(2rem,7vw,5.5rem)" }}
            >
              {slide.heading}
            </h1>

            {/* Script accent heading */}
            <h1
              className="font-bold leading-tight mb-5"
              style={{
                fontFamily: "var(--font-dancing)",
                fontSize: "clamp(2.25rem,8vw,6rem)",
              }}
            >
              <span
                ref={scriptRef}
                className="hero-script-text"
                style={{ "--hero-accent": slide.accent } as CSSProperties}
              >
                {slide.headingScript}
              </span>
            </h1>

            {/* Subtext */}
            <p
              ref={subRef}
              className="text-gray-500 text-base sm:text-lg leading-relaxed mb-6 sm:mb-7 max-w-md mx-auto lg:mx-0 px-1"
            >
              {slide.sub}
            </p>

            {/* Buttons */}
            <div ref={btnsRef} className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start mb-6 sm:mb-8 w-full sm:w-auto">
              <Link
                href={slide.btn1.href}
                className="group relative overflow-hidden px-6 sm:px-9 py-3.5 sm:py-4 rounded-full font-semibold text-white text-sm shadow-lg transition-transform hover:scale-105 active:scale-95 text-center w-full sm:w-auto"
                style={{
                  background:`linear-gradient(135deg, ${slide.accent}, #4C1D95)`,
                  boxShadow:`0 6px 30px ${slide.accent}45`,
                }}
              >
                <span className="relative z-10">{slide.btn1.text} →</span>
                {/* Shine on hover */}
                <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
              </Link>

              <Link
                href={slide.btn2.href}
                className="px-6 sm:px-9 py-3.5 sm:py-4 rounded-full font-semibold text-sm border-2 bg-white/70 backdrop-blur-sm hover:bg-white transition-all hover:scale-105 active:scale-95 text-center w-full sm:w-auto"
                style={{
                  borderColor:`${slide.accent}40`,
                  color: slide.accent,
                  boxShadow:"0 2px 16px rgba(0,0,0,0.06)",
                }}
              >
                {slide.btn2.text}
              </Link>
            </div>

            {/* Stats */}
            <div ref={statsRef} className="flex flex-wrap gap-4 sm:gap-8 justify-center lg:justify-start">
              {[
                { val:"500+", label:"Happy Customers" },
                { val:"4.9★", label:"Rating"          },
                { val:"100%", label:"Cruelty Free"    },
              ].map((s) => (
                <div key={s.label} className="text-center">
                  <p className="text-base font-bold text-gray-800">{s.val}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{s.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Visual */}
          <div ref={visualRef} className="flex-1 flex items-center justify-center w-full max-w-[18rem] sm:max-w-none mx-auto overflow-hidden">
            <div className="relative w-full aspect-square max-w-[16rem] sm:max-w-[18rem] md:w-[352px] md:h-[352px] md:max-w-none lg:w-[400px] lg:h-[400px] overflow-hidden">

              {/* Outer spinning ring */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 rounded-full"
                style={{ border:`2px dashed ${slide.accent}25` }}
              />
              {/* Middle ring */}
              <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
                className="absolute inset-8 rounded-full"
                style={{ border:`1px solid rgba(186,230,253,0.35)` }}
              />

              {/* Central glowing card */}
              <motion.div
                animate={{
                  boxShadow: [
                    `0 0 40px ${slide.accent}25, 0 0 80px ${slide.accent}10`,
                    `0 0 70px ${slide.accent}45, 0 0 120px ${slide.accent}20`,
                    `0 0 40px ${slide.accent}25, 0 0 80px ${slide.accent}10`,
                  ],
                }}
                transition={{ duration: 3.5, repeat: Infinity }}
                className="absolute inset-0 m-auto w-52 h-52 md:w-64 md:h-64 rounded-full flex items-center justify-center"
                style={{
                  background: "radial-gradient(circle, rgba(255,255,255,0.98) 60%, rgba(237,233,254,0.6) 100%)",
                  border: `2px solid ${slide.accent}20`,
                }}
              >
                <AnimatePresence mode="wait">
                  <motion.div
                    key={cur}
                    initial={{ scale: 0.6, opacity: 0, rotate: -15 }}
                    animate={{ scale: 1, opacity: 1, rotate: 0 }}
                    exit={{ scale: 0.6, opacity: 0, rotate: 15 }}
                    transition={{ type: "spring", stiffness: 260, damping: 22 }}
                    className="relative w-40 h-40 md:w-52 md:h-52 rounded-full overflow-hidden"
                  >
                    <Image
                      src={slide.image}
                      alt={slide.headingScript}
                      fill
                      className="object-cover select-none"
                      sizes="(max-width: 768px) 160px, 208px"
                      priority={cur === 0}
                      onError={(e) => { (e.target as HTMLImageElement).src = "/logo.png"; }}
                    />
                  </motion.div>
                </AnimatePresence>
              </motion.div>

              {/* Orbiting product pills */}
              {[
                { label:"Lip Gloss",  price:"$12", emoji:"💄", angle:0   },
                { label:"Lip Liner",  price:"$8",  emoji:"✏️", angle:120 },
                { label:"Keychain",   price:"$15", emoji:"🔑", angle:240 },
              ].map((chip, i) => {
                const radius = 165;
                const rad    = (chip.angle * Math.PI) / 180;
                return (
                  <motion.div
                    key={i}
                    className="absolute hidden md:block"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 20 + i*5, repeat:Infinity, ease:"linear" }}
                    style={{ inset:0 }}
                  >
                    <motion.div
                      animate={{ rotate: -360 }}
                      transition={{ duration: 20 + i*5, repeat:Infinity, ease:"linear" }}
                      className="absolute flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white shadow-md border text-xs font-semibold text-gray-700"
                      style={{
                        top:  `calc(50% + ${-radius * Math.cos(rad)}px - 18px)`,
                        left: `calc(50% + ${radius  * Math.sin(rad)}px - 42px)`,
                        borderColor:`${slide.accent}25`,
                        boxShadow:"0 4px 16px rgba(0,0,0,0.08)",
                      }}
                    >
                      <span>{chip.emoji}</span>
                      <span>{chip.label}</span>
                      <span style={{color:slide.accent}} className="font-bold">{chip.price}</span>
                    </motion.div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* ── Controls ── */}
      <div className="absolute bottom-4 sm:bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-2 sm:gap-3 z-20 px-4">
        <motion.button
          whileHover={{ scale:1.1 }} whileTap={{ scale:0.9 }}
          onClick={() => go(-1)}
          className="w-10 h-10 rounded-full bg-white/90 border shadow-sm flex items-center justify-center backdrop-blur-sm"
          style={{ borderColor:`${slide.accent}20` }}
        >
          <ChevronLeft className="w-4 h-4 text-gray-500" />
        </motion.button>

        <div className="flex gap-2 items-center">
          {displaySlides.map((_, i) => (
            <motion.button
              key={i}
              onClick={() => !busy && go(i > cur ? 1 : -1)}
              animate={{ width: i===cur ? "28px" : "8px" }}
              transition={{ duration:0.3 }}
              className="h-2 rounded-full"
              style={{
                background: i===cur
                  ? `linear-gradient(135deg, ${slide.accent}, #6D28D9)`
                  : "rgba(0,0,0,0.12)",
              }}
            />
          ))}
        </div>

        <motion.button
          whileHover={{ scale:1.1 }} whileTap={{ scale:0.9 }}
          onClick={() => go(1)}
          className="w-10 h-10 rounded-full bg-white/90 border shadow-sm flex items-center justify-center backdrop-blur-sm"
          style={{ borderColor:`${slide.accent}20` }}
        >
          <ChevronRight className="w-4 h-4 text-gray-500" />
        </motion.button>
      </div>

      {/* Scroll hint */}
      <motion.div
        animate={{ y:[0,10,0] }}
        transition={{ duration:2, repeat:Infinity }}
        className="absolute bottom-8 right-8 hidden md:flex flex-col items-center gap-1.5 text-gray-300 text-[10px] uppercase tracking-widest"
      >
        <span>Scroll</span>
        <div className="w-px h-8 bg-gradient-to-b from-gray-300 to-transparent" />
      </motion.div>
    </section>
  );
}
