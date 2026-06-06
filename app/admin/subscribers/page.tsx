"use client";
import { useEffect, useState } from "react";
import { Users, Download } from "lucide-react";

interface Subscriber {
  _id: string;
  email: string;
  discountCode: string;
  discountUsed: boolean;
  createdAt: string;
}

export default function AdminSubscribersPage() {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState(true);
  const token = typeof window !== "undefined" ? localStorage.getItem("admin_token") : "";

  useEffect(() => {
    fetch("/api/newsletter", { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => r.json())
      .then((d) => { setSubscribers(d.subscribers || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, [token]);

  const exportCSV = () => {
    const csv = ["Email,Discount Code,Used,Date", ...subscribers.map((s) => `${s.email},${s.discountCode},${s.discountUsed},${new Date(s.createdAt).toLocaleDateString()}`)].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "magic-lips-subscribers.csv";
    a.click();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Newsletter Subscribers</h1>
          <p className="text-white/40 text-sm">{subscribers.length} subscribers</p>
        </div>
        <button onClick={exportCSV} className="btn-secondary text-sm py-2.5 gap-2">
          <Download className="w-4 h-4" /> Export CSV
        </button>
      </div>

      <div className="glass-dark rounded-2xl border border-purple-500/20 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-white/40">Loading...</div>
        ) : subscribers.length === 0 ? (
          <div className="p-8 text-center">
            <Users className="w-12 h-12 text-white/20 mx-auto mb-3" />
            <p className="text-white/40">No subscribers yet</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-white/10">
                <tr>{["Email", "Discount Code", "Used", "Date"].map((h) => <th key={h} className="px-5 py-3 text-left text-white/40 text-xs uppercase tracking-wider">{h}</th>)}</tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {subscribers.map((s) => (
                  <tr key={s._id} className="hover:bg-white/5">
                    <td className="px-5 py-4 text-white text-sm">{s.email}</td>
                    <td className="px-5 py-4 text-purple-400 font-mono text-sm">{s.discountCode}</td>
                    <td className="px-5 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs ${s.discountUsed ? "text-green-400 bg-green-400/10" : "text-yellow-400 bg-yellow-400/10"}`}>
                        {s.discountUsed ? "Used" : "Active"}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-white/40 text-xs">{new Date(s.createdAt).toLocaleDateString()}</td>
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
