"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import toast from "react-hot-toast";
import { Mail } from "lucide-react";

export default function NewsletterSection() {
  const [email,       setEmail]       = useState("");
  const [loading,     setLoading]     = useState(false);
  const [subscribed,  setSubscribed]  = useState(false);
  const [discountCode,setDiscountCode]= useState("");
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.2 });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    try {
      const res  = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (res.ok || data.code) {
        setSubscribed(true);
        setDiscountCode(data.code || "MAGIC10");
        toast.success("Welcome to Magic Lips! ✨");
      } else {
        toast.error(data.error || "Something went wrong");
      }
    } catch {
      toast.error("Connection error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section
      id="newsletter"
      className="relative py-16 sm:py-20 md:py-24 overflow-hidden"
      style={{ background: "linear-gradient(135deg, #f3eeff 0%, #e8f5ff 50%, #fdf4ff 100%)" }}
    >
      {/* Soft blobs */}
      <div className="absolute top-0 left-1/4 w-72 h-72 rounded-full opacity-30 pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(196,181,253,0.5) 0%, transparent 70%)" }} />
      <div className="absolute bottom-0 right-1/4 w-56 h-56 rounded-full opacity-25 pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(186,230,253,0.6) 0%, transparent 70%)" }} />

      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 40 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.7 }}
        className="relative z-10 max-w-2xl mx-auto px-4 sm:px-6 text-center"
      >
        <motion.div
          animate={{ rotate: [0, 8, -8, 0] }}
          transition={{ duration: 4, repeat: Infinity }}
          className="text-5xl mb-6 inline-block"
        >
          💌
        </motion.div>

        <span className="inline-block px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider mb-5"
          style={{ background: "rgba(167,139,250,0.12)", color: "#5B21B6", border: "1px solid rgba(167,139,250,0.3)" }}>
          Exclusive Offer
        </span>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-3" style={{ fontFamily: "var(--font-playfair)" }}>
          Get <span className="text-gradient">10% Off</span>
        </h2>
        <p className="text-gray-500 text-lg mb-2">Your First Order</p>
        <p className="text-gray-400 text-sm mb-10 max-w-sm mx-auto leading-relaxed">
          Subscribe to our beauty list and instantly receive an exclusive discount code for your first order!
        </p>

        {!subscribed ? (
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <div className="flex-1 relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
              <input
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-11 pr-4 py-4 rounded-full bg-white border border-purple-100 text-gray-700 placeholder-gray-300 text-sm focus:outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-200 shadow-sm transition-all"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary px-8 py-4 text-sm whitespace-nowrap disabled:opacity-60"
            >
              {loading
                ? <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                    Joining...
                  </span>
                : "Subscribe & Save ✨"
              }
            </button>
          </form>
        ) : (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring" }}
            className="max-w-sm mx-auto"
          >
            <div
              className="rounded-3xl p-8 bg-white border shadow-sm"
              style={{ borderColor: "rgba(196,181,253,0.4)" }}
            >
              <div className="text-4xl mb-3">🎉</div>
              <h3 className="text-lg font-bold text-gray-900 mb-1">You&apos;re in!</h3>
              <p className="text-gray-400 text-sm mb-5">Your exclusive code:</p>
              <div
                className="rounded-2xl p-4 mb-3"
                style={{ background: "linear-gradient(135deg, #f3eeff, #e8f5ff)", border: "2px dashed rgba(167,139,250,0.4)" }}
              >
                <p className="text-2xl font-bold tracking-widest font-mono" style={{ color: "#5B21B6" }}>
                  {discountCode}
                </p>
              </div>
              <p className="text-gray-400 text-xs">Use at checkout for 10% off your first order!</p>
            </div>
          </motion.div>
        )}

        <p className="text-gray-300 text-xs mt-6">No spam. Unsubscribe anytime.</p>
      </motion.div>
    </section>
  );
}
