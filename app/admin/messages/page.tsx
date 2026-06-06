"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { MessageSquare, Mail, Phone } from "lucide-react";
import toast from "react-hot-toast";

interface Message {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [selected, setSelected] = useState<Message | null>(null);
  const [loading, setLoading] = useState(true);
  const token = typeof window !== "undefined" ? localStorage.getItem("admin_token") : "";
  const headers = { Authorization: `Bearer ${token}`, "Content-Type": "application/json" } as Record<string, string>;

  useEffect(() => {
    fetch("/api/contact", { headers }).then((r) => r.json()).then((d) => { setMessages(d.messages || []); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  const markRead = async (id: string) => {
    await fetch(`/api/contact/${id}`, { method: "PUT", headers, body: JSON.stringify({ isRead: true }) }).catch(() => {});
    setMessages((prev) => prev.map((m) => m._id === id ? { ...m, isRead: true } : m));
  };

  const handleSelect = (msg: Message) => {
    setSelected(msg);
    if (!msg.isRead) markRead(msg._id);
  };

  const unread = messages.filter((m) => !m.isRead).length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Contact Messages</h1>
        <p className="text-white/40 text-sm">{messages.length} total {unread > 0 && `· ${unread} unread`}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="glass-dark rounded-2xl border border-purple-500/20 overflow-hidden">
            {loading ? (
              <div className="p-8 text-center text-white/40">Loading...</div>
            ) : messages.length === 0 ? (
              <div className="p-8 text-center">
                <MessageSquare className="w-12 h-12 text-white/20 mx-auto mb-3" />
                <p className="text-white/40">No messages yet</p>
              </div>
            ) : (
              <div className="divide-y divide-white/5">
                {messages.map((msg) => (
                  <div
                    key={msg._id}
                    onClick={() => handleSelect(msg)}
                    className={`flex items-start gap-4 px-5 py-4 cursor-pointer hover:bg-white/5 transition-all ${selected?._id === msg._id ? "bg-purple-500/10" : ""}`}
                  >
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                      {msg.name[0].toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <p className={`text-sm font-medium ${msg.isRead ? "text-white/70" : "text-white"}`}>{msg.name}</p>
                        {!msg.isRead && <span className="w-2 h-2 rounded-full bg-purple-500 flex-shrink-0" />}
                      </div>
                      <p className="text-white/40 text-xs mb-1">{msg.email}</p>
                      <p className="text-white/50 text-xs truncate">{msg.message}</p>
                    </div>
                    <p className="text-white/30 text-xs flex-shrink-0">{new Date(msg.createdAt).toLocaleDateString()}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div>
          {selected ? (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="glass-dark rounded-2xl p-6 border border-purple-500/20 space-y-5">
              <div className="flex items-start justify-between">
                <h2 className="text-white font-bold">{selected.name}</h2>
                <button onClick={() => setSelected(null)} className="text-white/30 hover:text-white">×</button>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-white/60 text-sm"><Mail className="w-3.5 h-3.5" /> {selected.email}</div>
                {selected.phone && <div className="flex items-center gap-2 text-white/60 text-sm"><Phone className="w-3.5 h-3.5" /> {selected.phone}</div>}
              </div>
              <div className="glass rounded-xl p-4 border border-white/10">
                <p className="text-white/40 text-xs uppercase tracking-wider mb-2">Message</p>
                <p className="text-white/80 text-sm leading-relaxed whitespace-pre-wrap">{selected.message}</p>
              </div>
              <p className="text-white/30 text-xs">{new Date(selected.createdAt).toLocaleString()}</p>
              <a href={`mailto:${selected.email}`} className="block btn-primary text-sm text-center py-2.5">
                Reply via Email
              </a>
            </motion.div>
          ) : (
            <div className="glass-dark rounded-2xl p-8 border border-purple-500/20 text-center text-white/40">
              <MessageSquare className="w-10 h-10 mx-auto mb-3 opacity-30" />
              <p>Select a message to view</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
