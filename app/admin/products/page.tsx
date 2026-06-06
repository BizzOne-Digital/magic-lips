"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Plus, Edit, Trash2, Star, Package } from "lucide-react";
import toast from "react-hot-toast";

interface Product {
  _id: string;
  name: string;
  slug: string;
  price: number;
  stock: number;
  isFeatured: boolean;
  isActive: boolean;
  category: { name: string };
  images: string[];
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [categories, setCategories] = useState<{ _id: string; name: string }[]>([]);
  const [form, setForm] = useState({ name: "", description: "", price: "", stock: "100", category: "", images: "", isFeatured: false, isBundle: false });
  const token = typeof window !== "undefined" ? localStorage.getItem("admin_token") : "";
  const headers = { "Content-Type": "application/json", Authorization: `Bearer ${token}` } as Record<string, string>;

  const load = () => {
    setLoading(true);
    fetch("/api/products").then((r) => r.json()).then((d) => { setProducts(d.products || []); setLoading(false); });
    fetch("/api/categories").then((r) => r.json()).then((d) => setCategories(d.categories || []));
  };

  useEffect(() => { load(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = {
      name: form.name, description: form.description, price: parseFloat(form.price),
      stock: parseInt(form.stock), category: form.category, isFeatured: form.isFeatured, isBundle: form.isBundle,
      images: form.images ? form.images.split(",").map((s) => s.trim()).filter(Boolean) : [],
    };
    try {
      const res = editProduct
        ? await fetch(`/api/products/${editProduct.slug}`, { method: "PUT", headers, body: JSON.stringify(data) })
        : await fetch("/api/products", { method: "POST", headers, body: JSON.stringify(data) });
      if (res.ok) { toast.success(editProduct ? "Product updated!" : "Product created!"); setShowForm(false); setEditProduct(null); load(); }
      else toast.error("Failed to save product");
    } catch { toast.error("Error saving product"); }
  };

  const handleDelete = async (slug: string) => {
    if (!confirm("Delete this product?")) return;
    await fetch(`/api/products/${slug}`, { method: "DELETE", headers });
    toast.success("Product deleted");
    load();
  };

  const inputCls = "w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 text-sm focus:outline-none focus:border-purple-400 transition-all";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Products</h1>
          <p className="text-white/40 text-sm">{products.length} products</p>
        </div>
        <button onClick={() => { setShowForm(true); setEditProduct(null); setForm({ name: "", description: "", price: "", stock: "100", category: "", images: "", isFeatured: false, isBundle: false }); }} className="btn-primary text-sm py-2.5 gap-2">
          <Plus className="w-4 h-4" /> Add Product
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="glass-dark rounded-2xl p-6 border border-purple-500/20">
          <h2 className="text-lg font-semibold text-white mb-5">{editProduct ? "Edit" : "New"} Product</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div><label className="text-white/40 text-xs block mb-1">Name *</label><input value={form.name} onChange={(e) => setForm({...form, name: e.target.value})} className={inputCls} required /></div>
            <div><label className="text-white/40 text-xs block mb-1">Price (CAD) *</label><input type="number" step="0.01" value={form.price} onChange={(e) => setForm({...form, price: e.target.value})} className={inputCls} required /></div>
            <div><label className="text-white/40 text-xs block mb-1">Stock</label><input type="number" value={form.stock} onChange={(e) => setForm({...form, stock: e.target.value})} className={inputCls} /></div>
            <div><label className="text-white/40 text-xs block mb-1">Category</label>
              <select value={form.category} onChange={(e) => setForm({...form, category: e.target.value})} className={inputCls}>
                <option value="">Select category</option>
                {categories.map((c) => <option key={c._id} value={c._id} className="bg-[#0F0A2E]">{c.name}</option>)}
              </select>
            </div>
            <div className="sm:col-span-2"><label className="text-white/40 text-xs block mb-1">Description</label><textarea value={form.description} onChange={(e) => setForm({...form, description: e.target.value})} rows={3} className={`${inputCls} resize-none`} /></div>
            <div className="sm:col-span-2"><label className="text-white/40 text-xs block mb-1">Image URLs (comma-separated)</label><input value={form.images} onChange={(e) => setForm({...form, images: e.target.value})} className={inputCls} placeholder="https://..." /></div>
            <div className="flex gap-6">
              <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={form.isFeatured} onChange={(e) => setForm({...form, isFeatured: e.target.checked})} className="accent-purple-500" /><span className="text-white/60 text-sm">Featured</span></label>
              <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={form.isBundle} onChange={(e) => setForm({...form, isBundle: e.target.checked})} className="accent-purple-500" /><span className="text-white/60 text-sm">Bundle</span></label>
            </div>
            <div className="sm:col-span-2 flex gap-3">
              <button type="submit" className="btn-primary text-sm py-2.5">Save Product</button>
              <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2.5 rounded-xl glass border border-white/10 text-white/60 text-sm hover:text-white">Cancel</button>
            </div>
          </form>
        </motion.div>
      )}

      {/* Table */}
      <div className="glass-dark rounded-2xl border border-purple-500/20 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-white/40">Loading...</div>
        ) : products.length === 0 ? (
          <div className="p-8 text-center">
            <Package className="w-12 h-12 text-white/20 mx-auto mb-3" />
            <p className="text-white/40">No products yet. Add your first product or seed the database.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-white/10">
                <tr>{["Product", "Category", "Price", "Stock", "Featured", "Actions"].map((h) => <th key={h} className="px-5 py-3 text-left text-white/40 text-xs uppercase tracking-wider">{h}</th>)}</tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {products.map((p) => (
                  <tr key={p._id} className="hover:bg-white/5 transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-purple-900/40 flex items-center justify-center text-xl">
                          {p.images?.[0] ? <img src={p.images[0]} alt="" className="w-full h-full object-cover rounded-lg" /> : "💄"}
                        </div>
                        <p className="text-white font-medium text-sm">{p.name}</p>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-white/50 text-sm">{p.category?.name}</td>
                    <td className="px-5 py-4 text-white text-sm font-mono">${p.price}</td>
                    <td className="px-5 py-4"><span className={`text-sm ${p.stock > 10 ? "text-green-400" : p.stock > 0 ? "text-yellow-400" : "text-red-400"}`}>{p.stock}</span></td>
                    <td className="px-5 py-4">{p.isFeatured && <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />}</td>
                    <td className="px-5 py-4">
                      <div className="flex gap-2">
                        <button onClick={() => { setEditProduct(p); setForm({ name: p.name, description: "", price: String(p.price), stock: String(p.stock), category: "", images: p.images?.join(", ") || "", isFeatured: p.isFeatured, isBundle: false }); setShowForm(true); }} className="p-1.5 rounded-lg glass hover:bg-purple-500/20 text-white/50 hover:text-purple-400 transition-all">
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button onClick={() => handleDelete(p.slug)} className="p-1.5 rounded-lg glass hover:bg-red-500/20 text-white/50 hover:text-red-400 transition-all">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
