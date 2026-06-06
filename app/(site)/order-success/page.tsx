"use client";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import Sparkles from "@/components/ui/Sparkles";
import { CheckCircle, Package, ShoppingBag } from "lucide-react";

function SuccessContent() {
  const params = useSearchParams();
  const orderNumber = params.get("order");

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#07051A] to-[#0F0A2E] flex items-center justify-center relative overflow-hidden">
      <Sparkles count={30} />

      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 200 }}
        className="relative z-10 max-w-lg mx-auto px-4 sm:px-6 text-center py-8"
      >
        <motion.div
          animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }}
          transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
          className="text-6xl sm:text-8xl mb-6 inline-block"
        >
          🎉
        </motion.div>

        <div className="glass-dark rounded-3xl p-6 sm:p-10 border border-purple-500/30">
          <div className="w-16 h-16 rounded-full bg-green-500/20 border border-green-500/30 flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-8 h-8 text-green-400" />
          </div>

          <h1 className="text-3xl font-bold text-white mb-3" style={{ fontFamily: "var(--font-playfair)" }}>
            Order Placed!
          </h1>
          <p className="text-white/60 mb-6">
            Thank you for your purchase! Your order has been confirmed and we&apos;ll start preparing it right away.
          </p>

          {orderNumber && (
            <div className="glass rounded-xl p-4 border border-yellow-500/30 mb-6">
              <p className="text-white/50 text-sm mb-1">Order Number</p>
              <p className="text-yellow-400 font-bold text-lg font-mono">{orderNumber}</p>
            </div>
          )}

          <div className="space-y-3 mb-8 text-left">
            {[
              { icon: "📧", text: "Order confirmation email on its way" },
              { icon: "💄", text: "Your gloss is being prepared" },
              { icon: "🚚", text: "We'll email you when it ships" },
            ].map((item) => (
              <div key={item.text} className="flex items-center gap-3">
                <span className="text-xl">{item.icon}</span>
                <span className="text-white/70 text-sm">{item.text}</span>
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Link href="/shop" className="flex-1 btn-primary text-sm py-3 gap-2 justify-center">
              <ShoppingBag className="w-4 h-4" /> Shop More ✨
            </Link>
            <Link href="/" className="flex-1 btn-secondary text-sm py-3 justify-center">
              Home
            </Link>
          </div>
        </div>

        <p className="text-white/30 text-sm mt-6">
          Questions? Contact us at{" "}
          <a href="mailto:magiclips2013@gmail.com" className="text-purple-400 hover:underline">
            magiclips2013@gmail.com
          </a>
        </p>
      </motion.div>
    </div>
  );
}

export default function OrderSuccessPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#07051A] flex items-center justify-center text-white">Loading...</div>}>
      <SuccessContent />
    </Suspense>
  );
}
