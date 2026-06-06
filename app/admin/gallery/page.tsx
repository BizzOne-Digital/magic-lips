"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Plus, Trash2, Edit, Image as ImageIcon } from "lucide-react";
import toast from "react-hot-toast";
import ImageUploadField from "@/components/admin/ImageUploadField";

interface GalleryItem {
  _id: string;
  url: string;
  type: "image" | "video";
  title?: string;
  order: number;
}

const emptyForm = { url: "", type: "image", title: "", order: "0" };

export default function AdminGalleryPage() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState<GalleryItem | null>(null);
  const [form, setForm] = useState(emptyForm);
  const token = typeof window !== "undefined" ? localStorage.getItem("admin_token") : "";
  const headers = { "Content-Type": "application/json", Authorization: `Bearer ${token}` } as Record<string, string>;

  const load = () => {
    setLoading(true);
    fetch("/api/gallery").then((r) => r.json()).then((d) => { setItems(d.media || []); setLoading(false); });
  };

  useEffect(() => { load(); }, []);

  const openAdd = () => {
    setEditItem(null);
    setForm(emptyForm);
    setShowForm(true);
  };

  const openEdit = (item: GalleryItem) => {
    setEditItem(item);
    setForm({
      url: item.url,
      type: item.type,
      title: item.title || "",
      order: String(item.order ?? 0),
    });
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.type === "image" && !form.url.trim()) {
      toast.error("Please upload an image");
      return;
    }
    if (form.type === "video" && !form.url.trim()) {
      toast.error("Please enter a video URL");
      return;
    }
    const payload = {
      url: form.url.trim(),
      type: form.type,
      title: form.title.trim() || undefined,
      order: parseInt(form.order, 10),
    };
    try {
      const res = editItem
        ? await fetch(`/api/gallery/${editItem._id}`, { method: "PUT", headers, body: JSON.stringify(payload) })
        : await fetch("/api/gallery", { method: "POST", headers, body: JSON.stringify(payload) });
      if (res.ok) {
        toast.success(editItem ? "Gallery updated!" : "Added!");
        setShowForm(false);
        setEditItem(null);
        load();
      } else {
        toast.error("Failed to save");
      }
    } catch {
      toast.error("Error saving gallery item");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Remove this gallery item?")) return;
    await fetch(`/api/gallery/${id}`, { method: "DELETE", headers });
    toast.success("Removed");
    load();
  };

  const inputCls = "w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 text-sm focus:outline-none focus:border-purple-400";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Gallery</h1>
          <p className="text-white/40 text-sm">{items.length} items</p>
        </div>
        <button onClick={openAdd} className="btn-primary text-sm py-2.5 gap-2">
          <Plus className="w-4 h-4" /> Add Media
        </button>
      </div>

      {showForm && (
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="glass-dark rounded-2xl p-6 border border-purple-500/20">
          <h2 className="text-lg font-semibold text-white mb-5">{editItem ? "Edit Gallery Item" : "Add Media"}</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {form.type === "image" ? (
              <div className="sm:col-span-2">
                <ImageUploadField
                  label="Gallery Image"
                  value={form.url}
                  onChange={(url) => setForm({ ...form, url })}
                  required
                />
              </div>
            ) : (
              <div className="sm:col-span-2">
                <label className="text-white/40 text-xs block mb-1">Video URL *</label>
                <input value={form.url} onChange={(e) => setForm({ ...form, url: e.target.value })} className={inputCls} placeholder="https://..." required />
              </div>
            )}
            <div>
              <label className="text-white/40 text-xs block mb-1">Type</label>
              <select
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value, url: "" })}
                className={inputCls}
              >
                <option value="image" className="bg-[#0F0A2E]">Image</option>
                <option value="video" className="bg-[#0F0A2E]">Video</option>
              </select>
            </div>
            <div>
              <label className="text-white/40 text-xs block mb-1">Title</label>
              <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className={inputCls} />
            </div>
            <div>
              <label className="text-white/40 text-xs block mb-1">Order</label>
              <input type="number" value={form.order} onChange={(e) => setForm({ ...form, order: e.target.value })} className={inputCls} />
            </div>
            <div className="sm:col-span-2 flex gap-3">
              <button type="submit" className="btn-primary text-sm py-2.5">{editItem ? "Save Changes" : "Add to Gallery"}</button>
              <button type="button" onClick={() => { setShowForm(false); setEditItem(null); }} className="px-4 py-2.5 rounded-xl glass border border-white/10 text-white/60 text-sm">Cancel</button>
            </div>
          </form>
        </motion.div>
      )}

      {loading ? (
        <div className="text-center text-white/40 p-8">Loading...</div>
      ) : items.length === 0 ? (
        <div className="glass-dark rounded-2xl p-8 text-center">
          <ImageIcon className="w-12 h-12 text-white/20 mx-auto mb-3" />
          <p className="text-white/40">No gallery items yet</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {items.map((item, i) => (
            <motion.div key={item._id} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.04 }} className="group relative aspect-square rounded-xl overflow-hidden glass border border-white/10">
              {item.type === "video" ? (
                <video src={item.url} className="w-full h-full object-cover" muted />
              ) : (
                <img src={item.url} alt={item.title} className="w-full h-full object-cover" />
              )}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                <button
                  onClick={() => openEdit(item)}
                  className="p-3 rounded-full bg-purple-500/80 hover:bg-purple-500 text-white transition-all"
                  title="Edit"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(item._id)}
                  className="p-3 rounded-full bg-red-500/80 hover:bg-red-500 text-white transition-all"
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              {item.title && (
                <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/70 to-transparent">
                  <p className="text-white text-xs truncate">{item.title}</p>
                </div>
              )}
              <div className="absolute top-2 right-2">
                <span className="px-2 py-0.5 rounded-full bg-black/60 text-white/60 text-[10px]">{item.type}</span>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
