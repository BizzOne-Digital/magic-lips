"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Plus, Edit, Trash2, Tag } from "lucide-react";
import toast from "react-hot-toast";

interface Offer {
  _id: string;
  title: string;
  description: string;
  type: string;
  discountValue: number;
  couponCode?: string;
  isActive: boolean;
  usageCount: number;
}

export default function AdminOffersPage() {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: "", description: "", type: "percentage", discountValue: "10", couponCode: "", isActive: true });
  const token = typeof window !== "undefined" ? localStorage.getItem("admin_token") : "";
  const headers = { "Content-Type": "application/json", Authorization: `Bearer ${token}` } as Record<string, string>;

  const load = () => {
    fetch("/api/offers", { headers }).then((r) => r.json()).then((d) => { setOffers(d.offers || []); setLoading(false); }).catch(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = { ...form, discountValue: parseFloat(form.discountValue) };
    const res = await fetch("/api/offers", { method: "POST", headers, body: JSON.stringify(data) });
    if (res.ok) { toast.success("Offer created!"); setShowForm(false); load(); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this offer?")) return;
    await fetch(`/api/offers/${id}`, { method: "DELETE", headers });
    toast.success("Offer deleted");
    load();
  };

  const inputCls = "w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 text-sm focus:outline-none focus:border-purple-400";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Offers & Discounts</h1>
          <p className="text-white/40 text-sm">{offers.length} offers</p>
        </div>
        <button onClick={() => setShowForm(true)} className="btn-primary text-sm py-2.5 gap-2">
          <Plus className="w-4 h-4" /> Add Offer
        </button>
      </div>

      {showForm && (
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="glass-dark rounded-2xl p-6 border border-purple-500/20">
          <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2"><label className="text-white/40 text-xs block mb-1">Title *</label><input value={form.title} onChange={(e) => setForm({...form, title: e.target.value})} className={inputCls} required /></div>
            <div className="sm:col-span-2"><label className="text-white/40 text-xs block mb-1">Description</label><input value={form.description} onChange={(e) => setForm({...form, description: e.target.value})} className={inputCls} /></div>
            <div><label className="text-white/40 text-xs block mb-1">Type</label>
              <select value={form.type} onChange={(e) => setForm({...form, type: e.target.value})} className={inputCls}>
                {["percentage", "fixed", "bundle", "bogo"].map((t) => <option key={t} value={t} className="bg-[#0F0A2E]">{t}</option>)}
              </select>
            </div>
            <div><label className="text-white/40 text-xs block mb-1">Discount Value (%/$)</label><input type="number" step="0.01" value={form.discountValue} onChange={(e) => setForm({...form, discountValue: e.target.value})} className={inputCls} /></div>
            <div><label className="text-white/40 text-xs block mb-1">Coupon Code (optional)</label><input value={form.couponCode} onChange={(e) => setForm({...form, couponCode: e.target.value.toUpperCase()})} className={inputCls} placeholder="MAGIC10" /></div>
            <div className="flex items-center gap-2 mt-6"><input type="checkbox" checked={form.isActive} onChange={(e) => setForm({...form, isActive: e.target.checked})} className="accent-purple-500" /><span className="text-white/60 text-sm">Active</span></div>
            <div className="sm:col-span-2 flex gap-3">
              <button type="submit" className="btn-primary text-sm py-2.5">Save Offer</button>
              <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2.5 rounded-xl glass border border-white/10 text-white/60 text-sm">Cancel</button>
            </div>
          </form>
        </motion.div>
      )}

      <div className="space-y-3">
        {loading ? (
          <div className="p-8 text-center text-white/40">Loading...</div>
        ) : offers.length === 0 ? (
          <div className="glass-dark rounded-2xl p-8 text-center">
            <Tag className="w-12 h-12 text-white/20 mx-auto mb-3" />
            <p className="text-white/40">No offers yet</p>
          </div>
        ) : (
          offers.map((offer, i) => (
            <motion.div key={offer._id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="glass-dark rounded-xl p-5 border border-purple-500/20 flex items-center gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <p className="text-white font-medium">{offer.title}</p>
                  {!offer.isActive && <span className="text-xs px-2 py-0.5 rounded-full bg-red-500/20 text-red-400">Inactive</span>}
                </div>
                <p className="text-white/50 text-sm">{offer.description}</p>
                <div className="flex gap-3 mt-1">
                  <span className="text-purple-400 text-xs">{offer.type}: {offer.discountValue}{offer.type === "percentage" ? "%" : "$"}</span>
                  {offer.couponCode && <span className="text-yellow-400 text-xs font-mono">{offer.couponCode}</span>}
                  <span className="text-white/30 text-xs">Used: {offer.usageCount}×</span>
                </div>
              </div>
              <button onClick={() => handleDelete(offer._id)} className="p-2 rounded-lg glass hover:bg-red-500/20 text-white/50 hover:text-red-400 transition-all">
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
