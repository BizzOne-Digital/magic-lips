"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ShoppingCart } from "lucide-react";
import toast from "react-hot-toast";

interface Order {
  _id: string;
  orderNumber: string;
  customer: { name: string; email: string; phone?: string };
  items: { name: string; quantity: number; price: number }[];
  total: number;
  paymentStatus: string;
  orderStatus: string;
  createdAt: string;
  shippingAddress: { address: string; city: string; province: string; postalCode: string };
}

const statusOptions = ["pending", "confirmed", "shipped", "completed", "cancelled"];
const statusColors: Record<string, string> = {
  pending: "text-yellow-400 bg-yellow-400/10 border-yellow-400/30",
  confirmed: "text-blue-400 bg-blue-400/10 border-blue-400/30",
  shipped: "text-purple-400 bg-purple-400/10 border-purple-400/30",
  completed: "text-green-400 bg-green-400/10 border-green-400/30",
  cancelled: "text-red-400 bg-red-400/10 border-red-400/30",
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Order | null>(null);
  const token = typeof window !== "undefined" ? localStorage.getItem("admin_token") : "";
  const headers = { "Content-Type": "application/json", Authorization: `Bearer ${token}` } as Record<string, string>;

  useEffect(() => {
    fetch("/api/orders", { headers }).then((r) => r.json()).then((d) => { setOrders(d.orders || []); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  const updateStatus = async (id: string, orderStatus: string) => {
    await fetch(`/api/orders/${id}`, { method: "PUT", headers, body: JSON.stringify({ orderStatus }) });
    setOrders((prev) => prev.map((o) => o._id === id ? { ...o, orderStatus } : o));
    if (selected?._id === id) setSelected((prev) => prev ? { ...prev, orderStatus } : null);
    toast.success("Status updated!");
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Orders</h1>
        <p className="text-white/40 text-sm">{orders.length} total orders</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Orders list */}
        <div className="lg:col-span-2">
          <div className="glass-dark rounded-2xl border border-purple-500/20 overflow-hidden">
            {loading ? (
              <div className="p-8 text-center text-white/40">Loading...</div>
            ) : orders.length === 0 ? (
              <div className="p-8 text-center">
                <ShoppingCart className="w-12 h-12 text-white/20 mx-auto mb-3" />
                <p className="text-white/40">No orders yet</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="border-b border-white/10">
                    <tr>{["Order", "Customer", "Total", "Status", "Date"].map((h) => <th key={h} className="px-5 py-3 text-left text-white/40 text-xs uppercase tracking-wider">{h}</th>)}</tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {orders.map((o) => (
                      <tr key={o._id} onClick={() => setSelected(o)} className={`hover:bg-white/5 transition-colors cursor-pointer ${selected?._id === o._id ? "bg-purple-500/10" : ""}`}>
                        <td className="px-5 py-4 text-purple-400 font-mono text-xs">{o.orderNumber}</td>
                        <td className="px-5 py-4">
                          <p className="text-white text-sm">{o.customer?.name}</p>
                          <p className="text-white/40 text-xs">{o.customer?.email}</p>
                        </td>
                        <td className="px-5 py-4 text-white font-medium">${o.total?.toFixed(2)}</td>
                        <td className="px-5 py-4">
                          <span className={`px-2 py-1 rounded-full text-xs border ${statusColors[o.orderStatus] || ""} capitalize`}>{o.orderStatus}</span>
                        </td>
                        <td className="px-5 py-4 text-white/40 text-xs">{new Date(o.createdAt).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Order detail */}
        <div>
          {selected ? (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="glass-dark rounded-2xl p-6 border border-purple-500/20 space-y-5">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-white font-bold">{selected.orderNumber}</h2>
                  <p className="text-white/40 text-xs">{new Date(selected.createdAt).toLocaleString()}</p>
                </div>
                <button onClick={() => setSelected(null)} className="text-white/30 hover:text-white text-lg">×</button>
              </div>

              <div>
                <p className="text-white/40 text-xs uppercase tracking-wider mb-2">Customer</p>
                <p className="text-white">{selected.customer?.name}</p>
                <p className="text-white/60 text-sm">{selected.customer?.email}</p>
                {selected.customer?.phone && <p className="text-white/60 text-sm">{selected.customer.phone}</p>}
              </div>

              <div>
                <p className="text-white/40 text-xs uppercase tracking-wider mb-2">Shipping</p>
                <p className="text-white/70 text-sm">{selected.shippingAddress?.address}, {selected.shippingAddress?.city}, {selected.shippingAddress?.province} {selected.shippingAddress?.postalCode}</p>
              </div>

              <div>
                <p className="text-white/40 text-xs uppercase tracking-wider mb-2">Items</p>
                <div className="space-y-2">
                  {selected.items?.map((item, i) => (
                    <div key={i} className="flex justify-between text-sm">
                      <span className="text-white/70">{item.name} ×{item.quantity}</span>
                      <span className="text-white">${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                  <div className="border-t border-white/10 pt-2 flex justify-between font-bold">
                    <span className="text-white">Total</span>
                    <span className="text-white">${selected.total?.toFixed(2)} CAD</span>
                  </div>
                </div>
              </div>

              <div>
                <p className="text-white/40 text-xs uppercase tracking-wider mb-2">Update Status</p>
                <div className="grid grid-cols-2 gap-2">
                  {statusOptions.map((status) => (
                    <button
                      key={status}
                      onClick={() => updateStatus(selected._id, status)}
                      className={`px-3 py-2 rounded-xl text-xs font-medium border transition-all capitalize ${
                        selected.orderStatus === status
                          ? `${statusColors[status]} scale-105`
                          : "glass border-white/10 text-white/40 hover:text-white"
                      }`}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          ) : (
            <div className="glass-dark rounded-2xl p-8 border border-purple-500/20 text-center text-white/40">
              <ShoppingCart className="w-10 h-10 mx-auto mb-3 opacity-30" />
              <p>Click an order to view details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
