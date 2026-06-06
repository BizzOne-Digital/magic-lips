"use client";
import { useEffect, useState } from "react";
import { Settings, Save } from "lucide-react";
import toast from "react-hot-toast";

interface SiteSettings {
  businessName: string;
  phone: string;
  email: string;
  address: string;
  instagramHandle: string;
  tiktokHandle: string;
  announcementBarText: string;
  announcementBarActive: boolean;
  footerCopyright: string;
  webDesignCredit: string;
  metaTitle: string;
  metaDescription: string;
}

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<SiteSettings>({
    businessName: "Magic Lips", phone: "+1 647 495 0299", email: "magiclips2013@gmail.com",
    address: "3735 Dundas St W, York, ON M6S 2T6, Canada", instagramHandle: "magiclips2013",
    tiktokHandle: "magiclips02", announcementBarText: "✨ New subscribers get 10% off their first order!",
    announcementBarActive: true, footerCopyright: "© 2024 Magic Lips. All rights reserved.",
    webDesignCredit: "", metaTitle: "Magic Lips — Premium Lip Gloss & Beauty",
    metaDescription: "Shop premium lip gloss and beauty accessories at Magic Lips.",
  });
  const [saving, setSaving] = useState(false);
  const token = typeof window !== "undefined" ? localStorage.getItem("admin_token") : "";

  useEffect(() => {
    fetch("/api/settings").then((r) => r.json()).then((d) => { if (d.settings) setSettings(d.settings); });
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/settings", { method: "PUT", headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` }, body: JSON.stringify(settings) });
      if (res.ok) toast.success("Settings saved!");
      else toast.error("Failed to save");
    } catch { toast.error("Error saving"); }
    finally { setSaving(false); }
  };

  const inputCls = "w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 text-sm focus:outline-none focus:border-purple-400";
  const field = (key: keyof SiteSettings, label: string, type = "text", full = false) => (
    <div className={full ? "sm:col-span-2" : ""}>
      <label className="text-white/40 text-xs block mb-1">{label}</label>
      <input type={type} value={String(settings[key])} onChange={(e) => setSettings({...settings, [key]: e.target.value})} className={inputCls} />
    </div>
  );

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Site Settings</h1>
          <p className="text-white/40 text-sm">Manage your business information and site configuration</p>
        </div>
        <button onClick={handleSave} disabled={saving} className="btn-primary text-sm py-2.5 gap-2 disabled:opacity-50">
          <Save className="w-4 h-4" /> {saving ? "Saving..." : "Save Settings"}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Business */}
        <div className="glass-dark rounded-2xl p-6 border border-purple-500/20">
          <h2 className="text-lg font-semibold text-white mb-5 flex items-center gap-2"><Settings className="w-4 h-4 text-purple-400" /> Business Info</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {field("businessName", "Business Name", "text", true)}
            {field("phone", "Phone")}
            {field("email", "Email", "email")}
            {field("address", "Address", "text", true)}
            {field("instagramHandle", "Instagram Handle")}
            {field("tiktokHandle", "TikTok Handle")}
          </div>
        </div>

        {/* Site */}
        <div className="glass-dark rounded-2xl p-6 border border-purple-500/20">
          <h2 className="text-lg font-semibold text-white mb-5 flex items-center gap-2"><Settings className="w-4 h-4 text-purple-400" /> Site Config</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {field("metaTitle", "Meta Title", "text", true)}
            <div className="sm:col-span-2">
              <label className="text-white/40 text-xs block mb-1">Meta Description</label>
              <textarea value={settings.metaDescription} onChange={(e) => setSettings({...settings, metaDescription: e.target.value})} rows={2} className={`${inputCls} resize-none`} />
            </div>
            {field("footerCopyright", "Footer Copyright", "text", true)}
            {field("webDesignCredit", "Web Design Credit", "text", true)}
          </div>
          <div className="mt-4">
            <label className="text-white/40 text-xs block mb-1">Announcement Bar Text</label>
            <input value={settings.announcementBarText} onChange={(e) => setSettings({...settings, announcementBarText: e.target.value})} className={inputCls} />
          </div>
          <div className="mt-4 flex items-center gap-2">
            <input type="checkbox" checked={settings.announcementBarActive} onChange={(e) => setSettings({...settings, announcementBarActive: e.target.checked})} className="accent-purple-500" />
            <span className="text-white/60 text-sm">Announcement bar active</span>
          </div>
        </div>
      </div>
    </div>
  );
}
