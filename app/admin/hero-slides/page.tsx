"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Plus, Edit, Trash2, Layers, GripVertical, ImageIcon } from "lucide-react";
import toast from "react-hot-toast";
import ImageUploadField from "@/components/admin/ImageUploadField";

interface Slide {
  _id: string;
  heading: string;
  subheading: string;
  buttonText: string;
  buttonLink: string;
  secondaryButtonText?: string;
  secondaryButtonLink?: string;
  image?: string;
  order: number;
  isActive: boolean;
}

const emptyForm = {
  heading: "",
  subheading: "",
  buttonText: "Shop Now",
  buttonLink: "/shop",
  secondaryButtonText: "",
  secondaryButtonLink: "",
  image: "",
  order: "0",
  isActive: true,
};

export default function AdminHeroSlidesPage() {
  const [slides, setSlides] = useState<Slide[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editSlide, setEditSlide] = useState<Slide | null>(null);
  const [form, setForm] = useState(emptyForm);
  const token = typeof window !== "undefined" ? localStorage.getItem("admin_token") : "";
  const headers = { "Content-Type": "application/json", Authorization: `Bearer ${token}` } as Record<string, string>;

  const load = () => {
    setLoading(true);
    fetch("/api/hero-slides", { headers })
      .then((r) => r.json())
      .then((d) => { setSlides(d.slides || []); setLoading(false); });
  };

  useEffect(() => { load(); }, []);

  const openNew = () => {
    setEditSlide(null);
    setForm(emptyForm);
    setShowForm(true);
  };

  const openEdit = (slide: Slide) => {
    setEditSlide(slide);
    setForm({
      heading: slide.heading,
      subheading: slide.subheading,
      buttonText: slide.buttonText,
      buttonLink: slide.buttonLink,
      secondaryButtonText: slide.secondaryButtonText || "",
      secondaryButtonLink: slide.secondaryButtonLink || "",
      image: slide.image || "",
      order: String(slide.order),
      isActive: slide.isActive,
    });
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = { ...form, order: parseInt(form.order, 10), image: form.image.trim() || undefined };
    try {
      const res = editSlide
        ? await fetch(`/api/hero-slides/${editSlide._id}`, { method: "PUT", headers, body: JSON.stringify(data) })
        : await fetch("/api/hero-slides", { method: "POST", headers, body: JSON.stringify(data) });
      if (res.ok) {
        toast.success(editSlide ? "Slide updated!" : "Slide created!");
        setShowForm(false);
        setEditSlide(null);
        load();
      } else {
        toast.error("Failed to save slide");
      }
    } catch {
      toast.error("Error saving slide");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this slide?")) return;
    await fetch(`/api/hero-slides/${id}`, { method: "DELETE", headers });
    toast.success("Slide deleted");
    load();
  };

  const inputCls = "w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 text-sm focus:outline-none focus:border-purple-400";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Hero Slides</h1>
          <p className="text-white/40 text-sm">{slides.length} slides</p>
        </div>
        <button onClick={openNew} className="btn-primary text-sm py-2.5 gap-2">
          <Plus className="w-4 h-4" /> Add Slide
        </button>
      </div>

      {showForm && (
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="glass-dark rounded-2xl p-6 border border-purple-500/20">
          <h2 className="text-lg font-semibold text-white mb-5">{editSlide ? "Edit" : "New"} Slide</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="text-white/40 text-xs block mb-1">Heading *</label>
              <input value={form.heading} onChange={(e) => setForm({ ...form, heading: e.target.value })} className={inputCls} required />
            </div>
            <div className="sm:col-span-2">
              <label className="text-white/40 text-xs block mb-1">Subheading *</label>
              <textarea value={form.subheading} onChange={(e) => setForm({ ...form, subheading: e.target.value })} rows={2} className={`${inputCls} resize-none`} required />
            </div>
            <div className="sm:col-span-2">
              <ImageUploadField
                label="Circle Image"
                hint="Upload hero circle image — JPG, PNG, WebP or GIF"
                value={form.image}
                onChange={(image) => setForm({ ...form, image })}
                rounded="full"
              />
            </div>
            <div>
              <label className="text-white/40 text-xs block mb-1">Button Text *</label>
              <input value={form.buttonText} onChange={(e) => setForm({ ...form, buttonText: e.target.value })} className={inputCls} required />
            </div>
            <div>
              <label className="text-white/40 text-xs block mb-1">Button Link *</label>
              <input value={form.buttonLink} onChange={(e) => setForm({ ...form, buttonLink: e.target.value })} className={inputCls} required />
            </div>
            <div>
              <label className="text-white/40 text-xs block mb-1">Secondary Button Text</label>
              <input value={form.secondaryButtonText} onChange={(e) => setForm({ ...form, secondaryButtonText: e.target.value })} className={inputCls} />
            </div>
            <div>
              <label className="text-white/40 text-xs block mb-1">Secondary Button Link</label>
              <input value={form.secondaryButtonLink} onChange={(e) => setForm({ ...form, secondaryButtonLink: e.target.value })} className={inputCls} />
            </div>
            <div>
              <label className="text-white/40 text-xs block mb-1">Order</label>
              <input type="number" value={form.order} onChange={(e) => setForm({ ...form, order: e.target.value })} className={inputCls} />
            </div>
            <div className="flex items-center gap-2 mt-6">
              <input type="checkbox" checked={form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.checked })} className="accent-purple-500" />
              <span className="text-white/60 text-sm">Active</span>
            </div>
            <div className="sm:col-span-2 flex gap-3">
              <button type="submit" className="btn-primary text-sm py-2.5">Save Slide</button>
              <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2.5 rounded-xl glass border border-white/10 text-white/60 text-sm">Cancel</button>
            </div>
          </form>
        </motion.div>
      )}

      <div className="space-y-3">
        {loading ? (
          <div className="p-8 text-center text-white/40">Loading...</div>
        ) : slides.length === 0 ? (
          <div className="glass-dark rounded-2xl p-8 text-center">
            <Layers className="w-12 h-12 text-white/20 mx-auto mb-3" />
            <p className="text-white/40">No slides. Add one above or seed the database.</p>
          </div>
        ) : (
          slides.map((slide, i) => (
            <motion.div
              key={slide._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="glass-dark rounded-xl p-5 border border-purple-500/20 flex items-center gap-4"
            >
              <GripVertical className="w-5 h-5 text-white/20 hidden sm:block" />
              <div className="relative w-14 h-14 rounded-full overflow-hidden flex-shrink-0 border border-purple-500/30 bg-white/5">
                {slide.image ? (
                  <Image src={slide.image} alt="" fill className="object-cover" unoptimized />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-white/20">
                    <ImageIcon className="w-5 h-5" />
                  </div>
                )}
              </div>
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                {slide.order + 1}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white font-medium">{slide.heading}</p>
                <p className="text-white/50 text-sm truncate">{slide.subheading}</p>
                <div className="flex gap-3 mt-1 flex-wrap">
                  <span className="text-purple-400 text-xs">{slide.buttonText} → {slide.buttonLink}</span>
                  {slide.image && <span className="text-sky-400 text-xs truncate max-w-[180px]">{slide.image}</span>}
                  {!slide.isActive && <span className="text-red-400 text-xs">Hidden</span>}
                </div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => openEdit(slide)} className="p-2 rounded-lg glass hover:bg-purple-500/20 text-white/50 hover:text-purple-400 transition-all">
                  <Edit className="w-3.5 h-3.5" />
                </button>
                <button onClick={() => handleDelete(slide._id)} className="p-2 rounded-lg glass hover:bg-red-500/20 text-white/50 hover:text-red-400 transition-all">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
