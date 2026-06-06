"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import toast from "react-hot-toast";
import { Phone, Mail, MapPin, Send } from "lucide-react";

export default function ContactSection() {
  const [form,    setForm]    = useState({ name: "", email: "", phone: "", message: "" });
  const [loading, setLoading] = useState(false);
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        toast.success("Message sent! We'll get back to you soon 💄");
        setForm({ name: "", email: "", phone: "", message: "" });
      } else {
        toast.error("Failed to send. Please try again.");
      }
    } catch {
      toast.error("Connection error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const inputCls =
    "w-full px-4 py-3 rounded-xl bg-white border border-purple-100 text-gray-700 placeholder-gray-300 text-sm focus:outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 transition-all shadow-sm";

  return (
    <section
      ref={ref}
      id="contact"
      className="py-16 sm:py-20 md:py-24"
      style={{ background: "linear-gradient(135deg, #f8f4ff 0%, #f0f9ff 100%)" }}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-14"
        >
          <span className="inline-block px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider mb-5"
            style={{ background: "rgba(167,139,250,0.12)", color: "#5B21B6", border: "1px solid rgba(167,139,250,0.3)" }}>
            💌 Get In Touch
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-3" style={{ fontFamily: "var(--font-playfair)" }}>
            Contact <span className="text-gradient">Us</span>
          </h2>
          <p className="text-gray-400 max-w-md mx-auto">
            Have a question? Say hi to Junie and the Magic Lips team!
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Info */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.15 }}
            className="space-y-6"
          >
            <p className="text-gray-500 leading-relaxed">
              We&apos;re here to help with product questions, orders, and anything beauty-related. Don&apos;t be shy — reach out!
            </p>

            {[
              { icon: Phone, label: "Phone",   value: "+1 647 495 0299",     href: "tel:+16474950299" },
              { icon: Mail,  label: "Email",   value: "magiclips2013@gmail.com", href: "mailto:magiclips2013@gmail.com" },
              { icon: MapPin,label: "Address", value: "3735 Dundas St W, York, ON M6S 2T6", href: null },
            ].map((item) => (
              <div key={item.label} className="flex items-start gap-4">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: "rgba(167,139,250,0.12)", border: "1px solid rgba(167,139,250,0.25)" }}
                >
                  <item.icon className="w-4 h-4" style={{ color: "#5B21B6" }} />
                </div>
                <div>
                  <p className="text-gray-400 text-xs uppercase tracking-wider mb-0.5">{item.label}</p>
                  {item.href
                    ? <a href={item.href} className="text-gray-700 hover:text-violet-900 text-sm transition-colors">{item.value}</a>
                    : <p className="text-gray-700 text-sm">{item.value}</p>
                  }
                </div>
              </div>
            ))}

            {/* Junie card */}
            <div
              className="rounded-2xl p-5 bg-white border shadow-sm"
              style={{ borderColor: "rgba(196,181,253,0.3)" }}
            >
              <p className="text-xs text-violet-800 uppercase tracking-wider mb-1">Contact Person</p>
              <p className="text-lg font-bold text-gray-900">Junie 💄</p>
              <p className="text-gray-400 text-sm mt-1">
                Magic Lips founder. Happy to help with anything beauty!
              </p>
            </div>
          </motion.div>

          {/* Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.25 }}
          >
            <form
              onSubmit={handleSubmit}
              className="bg-white rounded-3xl p-5 sm:p-8 border space-y-5 shadow-sm"
              style={{ borderColor: "rgba(196,181,253,0.25)" }}
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-gray-400 text-xs uppercase tracking-wider block mb-2">Name *</label>
                  <input type="text" placeholder="Your name" value={form.name}
                    onChange={(e) => setForm({...form, name: e.target.value})} className={inputCls} required />
                </div>
                <div>
                  <label className="text-gray-400 text-xs uppercase tracking-wider block mb-2">Phone</label>
                  <input type="tel" placeholder="Your phone" value={form.phone}
                    onChange={(e) => setForm({...form, phone: e.target.value})} className={inputCls} />
                </div>
              </div>
              <div>
                <label className="text-gray-400 text-xs uppercase tracking-wider block mb-2">Email *</label>
                <input type="email" placeholder="your@email.com" value={form.email}
                  onChange={(e) => setForm({...form, email: e.target.value})} className={inputCls} required />
              </div>
              <div>
                <label className="text-gray-400 text-xs uppercase tracking-wider block mb-2">Message *</label>
                <textarea placeholder="How can we help?" value={form.message} rows={5}
                  onChange={(e) => setForm({...form, message: e.target.value})} className={`${inputCls} resize-none`} required />
              </div>
              <button type="submit" disabled={loading} className="w-full btn-primary py-4 gap-2 disabled:opacity-60">
                {loading
                  ? <span className="flex items-center justify-center gap-2">
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Sending...
                    </span>
                  : <><Send className="w-4 h-4" /> Send Message</>
                }
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
