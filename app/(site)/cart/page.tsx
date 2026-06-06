"use client";
import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Trash2, Plus, Minus, ShoppingBag, Tag, ArrowLeft } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import toast from "react-hot-toast";

export default function CartPage() {
  const { items, removeItem, updateQuantity, getSubtotal, getTotal, discount, couponCode, applyCoupon, removeCoupon, clearCart } = useCartStore();
  const [coupon, setCoupon] = useState("");
  const [validating, setValidating] = useState(false);

  const subtotal = getSubtotal();
  const total = getTotal();
  const discountAmount = subtotal - total;

  const validateCoupon = async () => {
    if (!coupon.trim()) return;
    setValidating(true);
    try {
      const res = await fetch("/api/coupon/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: coupon }),
      });
      const data = await res.json();
      if (res.ok && data.valid) {
        applyCoupon(coupon, data.discountPercent);
        toast.success(data.message || "Coupon applied!");
      } else {
        toast.error(data.error || "Invalid coupon");
      }
    } catch {
      toast.error("Error validating coupon");
    } finally {
      setValidating(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-[#07051A] flex items-center justify-center px-4 sm:px-6">
        <div className="text-center">
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-8xl mb-6">🛍️</motion.div>
          <h2 className="text-3xl font-bold text-white mb-4" style={{ fontFamily: "var(--font-playfair)" }}>
            Your Cart is Empty
          </h2>
          <p className="text-white/50 mb-8">Time to add some magic to your bag!</p>
          <Link href="/shop" className="btn-primary">Shop Now ✨</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#07051A] to-[#0F0A2E] py-8 sm:py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <Link href="/shop" className="inline-flex items-center gap-2 text-white/50 hover:text-white mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Continue Shopping
        </Link>

        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-8 sm:mb-10" style={{ fontFamily: "var(--font-playfair)" }}>
          Shopping <span className="text-gradient">Cart</span>
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Items */}
          <div className="lg:col-span-2 space-y-4">
            <AnimatePresence>
              {items.map((item) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20, height: 0 }}
                  className="glass-dark rounded-2xl p-4 sm:p-5 border border-white/10"
                >
                  <div className="flex items-start gap-3 sm:gap-4">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl bg-gradient-to-br from-purple-900/60 to-pink-900/60 flex items-center justify-center flex-shrink-0">
                      {item.image ? (
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover rounded-xl" />
                      ) : (
                        <span className="text-2xl sm:text-3xl">💄</span>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3 className="text-white font-semibold text-sm sm:text-base leading-snug">{item.name}</h3>
                      <p className="text-purple-400 text-xs sm:text-sm">${item.price} CAD each</p>
                    </div>

                    <button onClick={() => { removeItem(item.id); toast.success("Item removed"); }} className="text-red-400/60 hover:text-red-400 transition-colors flex-shrink-0 p-1">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/10">
                    <div className="flex items-center bg-white/5 rounded-xl border border-white/10">
                      <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="p-2.5 hover:bg-white/10 rounded-l-xl">
                        <Minus className="w-3 h-3 text-white" />
                      </button>
                      <span className="px-3 text-white text-sm font-medium min-w-[2rem] text-center">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="p-2.5 hover:bg-white/10 rounded-r-xl">
                        <Plus className="w-3 h-3 text-white" />
                      </button>
                    </div>

                    <p className="text-white font-bold text-base sm:text-lg">${(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            <button onClick={() => { clearCart(); toast.success("Cart cleared"); }} className="text-white/30 hover:text-red-400 text-sm transition-colors flex items-center gap-1">
              <Trash2 className="w-3.5 h-3.5" /> Clear Cart
            </button>
          </div>

          {/* Summary */}
          <div className="space-y-4 lg:sticky lg:top-24 lg:self-start">
            <div className="glass-dark rounded-2xl p-5 sm:p-6 border border-purple-500/20">
              <h2 className="text-xl font-bold text-white mb-5">Order Summary</h2>

              <div className="space-y-3 mb-5">
                <div className="flex justify-between text-sm">
                  <span className="text-white/60">Subtotal</span>
                  <span className="text-white">${subtotal.toFixed(2)} CAD</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-green-400 flex items-center gap-1"><Tag className="w-3 h-3" />{couponCode} ({discount}% off)</span>
                    <span className="text-green-400">-${discountAmount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span className="text-white/60">Shipping</span>
                  <span className="text-white">{subtotal >= 30 ? "Free 🎉" : "$5.00"}</span>
                </div>
                <div className="border-t border-white/10 pt-3 flex justify-between">
                  <span className="text-white font-semibold">Total</span>
                  <span className="text-xl font-bold text-white">${(total + (subtotal >= 30 ? 0 : 5)).toFixed(2)} CAD</span>
                </div>
              </div>

              {/* Coupon */}
              {!couponCode ? (
                <div className="mb-5">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Discount code"
                      value={coupon}
                      onChange={(e) => setCoupon(e.target.value.toUpperCase())}
                      className="flex-1 px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 text-sm focus:outline-none focus:border-purple-400"
                    />
                    <button onClick={validateCoupon} disabled={validating} className="px-4 py-2 rounded-xl bg-purple-600/30 hover:bg-purple-600 border border-purple-500/30 text-white text-sm transition-all disabled:opacity-50">
                      Apply
                    </button>
                  </div>
                </div>
              ) : (
                <div className="mb-5 flex items-center justify-between p-3 rounded-xl bg-green-500/10 border border-green-500/30">
                  <span className="text-green-400 text-sm">{couponCode} applied ✓</span>
                  <button onClick={removeCoupon} className="text-white/40 hover:text-white/70 text-xs">Remove</button>
                </div>
              )}

              <Link href="/checkout" className="block btn-primary text-center py-4">
                <ShoppingBag className="w-5 h-5 inline mr-2" />
                Proceed to Checkout
              </Link>

              <p className="text-center text-white/30 text-xs mt-4">🔒 Secure & encrypted checkout</p>
            </div>

            {subtotal < 30 && (
              <div className="glass-dark rounded-xl p-4 border border-amber-400/30 text-center">
                <p className="text-white text-sm">
                  Add ${(30 - subtotal).toFixed(2)} more for <strong className="text-amber-300">free shipping</strong>!
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
