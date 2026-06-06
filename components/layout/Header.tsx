"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useCartStore } from "@/store/cartStore";
import { ShoppingBag, Menu, X } from "lucide-react";

const navLinks = [
  { href: "/",        label: "Home"    },
  { href: "/shop",    label: "Shop"    },
  { href: "/offers",  label: "Offers"  },
  { href: "/about",   label: "About"   },
  { href: "/gallery", label: "Gallery" },
  { href: "/contact", label: "Contact" },
];

export default function Header() {
  const [scrolled,    setScrolled]    = useState(false);
  const [mobileOpen,  setMobileOpen]  = useState(false);
  const itemCount = useCartStore((s) => s.getItemCount());

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!mobileOpen) return;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-[100] px-3 sm:px-4 py-2 sm:py-2.5">
        <motion.nav
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className={`max-w-6xl mx-auto rounded-full px-3 sm:px-4 py-2 flex items-center justify-between gap-2 transition-all duration-500 bg-white/95 shadow-[0_4px_30px_rgba(196,181,253,0.35)] border border-purple-100 ${
            scrolled ? "shadow-[0_6px_36px_rgba(196,181,253,0.45)]" : ""
          }`}
          style={{ backdropFilter: "blur(20px)" }}
        >
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 flex-shrink-0">
            <motion.div whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.95 }}>
              <Image
                src="/logo.png"
                alt="Magic Lips"
                width={40}
                height={40}
                className="object-contain"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "/logo.svg";
                }}
              />
            </motion.div>
            <span
              className="font-bold text-lg hidden sm:block"
              style={{
                fontFamily: "var(--font-dancing)",
                backgroundImage: "linear-gradient(135deg, #5B21B6, #0EA5E9)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Magic Lips
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="relative px-4 py-2 text-sm font-medium text-gray-600 hover:text-violet-800 transition-colors duration-300 group"
              >
                {link.label}
                <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-0 h-0.5 rounded-full bg-gradient-to-r from-violet-400 to-sky-400 group-hover:w-full transition-all duration-300 ease-out" />
              </Link>
            ))}
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-2">
            {/* Cart */}
            <Link href="/cart" className="relative">
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="p-2 rounded-full hover:bg-violet-100 transition-colors"
              >
                <ShoppingBag className="w-5 h-5 text-gray-600" />
                {itemCount > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-gradient-to-r from-violet-500 to-sky-400 text-white text-[9px] font-bold flex items-center justify-center"
                  >
                    {itemCount > 9 ? "9+" : itemCount}
                  </motion.span>
                )}
              </motion.div>
            </Link>

            {/* CTA */}
            <Link href="/shop" className="hidden sm:flex btn-primary text-sm px-5 py-2">
              Shop Now
            </Link>

            {/* Hamburger */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden p-2 rounded-full hover:bg-violet-100 transition-colors"
            >
              {mobileOpen
                ? <X    className="w-5 h-5 text-gray-600" />
                : <Menu className="w-5 h-5 text-gray-600" />
              }
            </button>
          </div>
        </motion.nav>

        {/* Mobile menu */}
        <AnimatePresence>
          {mobileOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[110] bg-black/40 lg:hidden"
                onClick={() => setMobileOpen(false)}
              />
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.97 }}
                transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                className="lg:hidden fixed left-3 right-3 top-[4.25rem] z-[120] max-h-[calc(100vh-5rem)] overflow-y-auto rounded-2xl bg-white/98 shadow-[0_8px_32px_rgba(196,181,253,0.3)] border border-purple-100"
                style={{ backdropFilter: "blur(20px)" }}
              >
                <nav className="flex flex-col p-3 gap-0.5">
                  {navLinks.map((link, i) => (
                    <motion.div
                      key={link.href}
                      initial={{ x: -16, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: i * 0.04 }}
                    >
                      <Link
                        href={link.href}
                        onClick={() => setMobileOpen(false)}
                        className="block px-4 py-3.5 text-gray-700 hover:text-violet-800 hover:bg-violet-100 rounded-xl transition-all text-sm font-medium"
                      >
                        {link.label}
                      </Link>
                    </motion.div>
                  ))}
                  <Link
                    href="/shop"
                    onClick={() => setMobileOpen(false)}
                    className="mt-2 btn-primary text-sm text-center py-3"
                  >
                    Shop Now ✨
                  </Link>
                </nav>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </header>
      {/* Spacer so content sits below fixed header */}
      <div className="h-[3.75rem] sm:h-16 shrink-0" aria-hidden />
    </>
  );
}
