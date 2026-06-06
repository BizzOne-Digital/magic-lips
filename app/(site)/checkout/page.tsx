"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, Package, Lock } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import toast from "react-hot-toast";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, getTotal, getSubtotal, discount, couponCode, clearCart } = useCartStore();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "", email: "", phone: "",
    address: "", city: "", province: "ON", postalCode: "",
  });

  const subtotal = getSubtotal();
  const total = getTotal();
  const shipping = subtotal >= 30 ? 0 : 5;
  const finalTotal = total + shipping;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) { toast.error("Your cart is empty"); return; }
    setLoading(true);

    try {
      const orderData = {
        customer: { name: form.name, email: form.email, phone: form.phone },
        shippingAddress: { address: form.address, city: form.city, province: form.province, postalCode: form.postalCode, country: "Canada" },
        items: items.map((i) => ({ name: i.name, price: i.price, quantity: i.quantity, image: i.image })),
        subtotal,
        discount: subtotal - total,
        shipping,
        total: finalTotal,
        couponCode: couponCode || undefined,
        paymentMethod: "cash_on_delivery",
        paymentStatus: "pending",
        orderStatus: "pending",
      };

      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      });

      const data = await res.json();
      if (res.ok) {
        clearCart();
        router.push(`/order-success?order=${data.orderNumber}`);
      } else {
        toast.error("Order failed. Please try again.");
      }
    } catch {
      toast.error("Connection error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 text-sm focus:outline-none focus:border-purple-400 transition-all";

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-[#07051A] flex items-center justify-center px-4 sm:px-6">
        <div className="text-center">
          <div className="text-6xl mb-4">🛍️</div>
          <h2 className="text-2xl font-bold text-white mb-4">No items to checkout</h2>
          <Link href="/shop" className="btn-primary">Shop Now</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#07051A] to-[#0F0A2E] py-8 sm:py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <Link href="/cart" className="inline-flex items-center gap-2 text-white/50 hover:text-white mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Cart
        </Link>

        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-8 sm:mb-10" style={{ fontFamily: "var(--font-playfair)" }}>
          Checkout
        </h1>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {/* Contact */}
            <div className="glass-dark rounded-2xl p-5 sm:p-6 border border-purple-500/20">
              <h2 className="text-lg font-semibold text-white mb-4">Contact Information</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div><label className="text-white/40 text-xs uppercase tracking-wider block mb-2">Full Name *</label>
                <input type="text" value={form.name} onChange={(e) => setForm({...form, name: e.target.value})} className={inputClass} placeholder="Your full name" required /></div>
                <div><label className="text-white/40 text-xs uppercase tracking-wider block mb-2">Phone</label>
                <input type="tel" value={form.phone} onChange={(e) => setForm({...form, phone: e.target.value})} className={inputClass} placeholder="+1 647 000 0000" /></div>
                <div className="sm:col-span-2"><label className="text-white/40 text-xs uppercase tracking-wider block mb-2">Email *</label>
                <input type="email" value={form.email} onChange={(e) => setForm({...form, email: e.target.value})} className={inputClass} placeholder="your@email.com" required /></div>
              </div>
            </div>

            {/* Shipping */}
            <div className="glass-dark rounded-2xl p-5 sm:p-6 border border-purple-500/20">
              <h2 className="text-lg font-semibold text-white mb-4">Shipping Address</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2"><label className="text-white/40 text-xs uppercase tracking-wider block mb-2">Street Address *</label>
                <input type="text" value={form.address} onChange={(e) => setForm({...form, address: e.target.value})} className={inputClass} placeholder="123 Main Street" required /></div>
                <div><label className="text-white/40 text-xs uppercase tracking-wider block mb-2">City *</label>
                <input type="text" value={form.city} onChange={(e) => setForm({...form, city: e.target.value})} className={inputClass} placeholder="Toronto" required /></div>
                <div><label className="text-white/40 text-xs uppercase tracking-wider block mb-2">Province *</label>
                <select value={form.province} onChange={(e) => setForm({...form, province: e.target.value})} className={inputClass}>
                  {["ON", "BC", "AB", "QC", "MB", "SK", "NS", "NB", "NL", "PEI", "NT", "YT", "NU"].map((p) => <option key={p} value={p} className="bg-[#0F0A2E]">{p}</option>)}
                </select></div>
                <div><label className="text-white/40 text-xs uppercase tracking-wider block mb-2">Postal Code *</label>
                <input type="text" value={form.postalCode} onChange={(e) => setForm({...form, postalCode: e.target.value.toUpperCase()})} className={inputClass} placeholder="M6S 2T6" required /></div>
              </div>
            </div>

            {/* Payment note */}
            <div className="glass rounded-xl p-4 border border-yellow-500/20">
              <div className="flex items-center gap-3">
                <Package className="w-5 h-5 text-yellow-400 flex-shrink-0" />
                <div>
                  <p className="text-white/80 text-sm font-medium">Payment on Delivery</p>
                  <p className="text-white/50 text-xs mt-0.5">Pay securely when your order arrives. We&apos;ll confirm your order by email.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div>
            <div className="glass-dark rounded-2xl p-5 sm:p-6 border border-purple-500/20 lg:sticky lg:top-24">
              <h2 className="text-lg font-semibold text-white mb-5">Order Summary</h2>
              <div className="space-y-3 mb-5">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg bg-purple-900/40 flex items-center justify-center text-2xl flex-shrink-0">
                      {item.image ? <img src={item.image} alt="" className="w-full h-full object-cover rounded-lg" /> : "💄"}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-xs font-medium truncate">{item.name}</p>
                      <p className="text-white/50 text-xs">×{item.quantity}</p>
                    </div>
                    <p className="text-white text-sm">${(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                ))}
              </div>
              <div className="border-t border-white/10 pt-4 space-y-2 text-sm mb-5">
                <div className="flex justify-between"><span className="text-white/60">Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
                {discount > 0 && <div className="flex justify-between"><span className="text-green-400">{couponCode} ({discount}%)</span><span className="text-green-400">-${(subtotal - total).toFixed(2)}</span></div>}
                <div className="flex justify-between"><span className="text-white/60">Shipping</span><span>{shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}</span></div>
                <div className="border-t border-white/10 pt-2 flex justify-between font-bold text-base">
                  <span>Total</span><span className="text-white">${finalTotal.toFixed(2)} CAD</span>
                </div>
              </div>

              <button type="submit" disabled={loading} className="w-full btn-primary py-4 gap-2 disabled:opacity-50 text-center text-sm sm:text-base">
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Processing...
                  </span>
                ) : (
                  <span className="inline-flex items-center justify-center gap-2 flex-wrap">
                    <Lock className="w-4 h-4 flex-shrink-0" />
                    <span>Place Order — ${finalTotal.toFixed(2)} CAD</span>
                  </span>
                )}
              </button>
              <p className="text-center text-white/30 text-xs mt-3 flex items-center justify-center gap-1">
                <Lock className="w-3 h-3" /> Secure & encrypted
              </p>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
