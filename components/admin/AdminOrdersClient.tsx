"use client";
// components/admin/AdminOrdersClient.tsx
import { useState } from "react";
import { Order } from "@/types";
import { Search, Eye, ChevronDown } from "lucide-react";
import toast from "react-hot-toast";

const statusColors: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-700 border-yellow-200",
  PAID: "bg-blue-100 text-blue-700 border-blue-200",
  PROCESSING: "bg-purple-100 text-purple-700 border-purple-200",
  SHIPPED: "bg-indigo-100 text-indigo-700 border-indigo-200",
  DELIVERED: "bg-green-100 text-green-700 border-green-200",
  CANCELLED: "bg-red-100 text-red-700 border-red-200",
  REFUNDED: "bg-gray-100 text-gray-700 border-gray-200",
};

const ALL_STATUSES = ["PENDING", "PAID", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED", "REFUNDED"];

export default function AdminOrdersClient({ orders: initialOrders }: { orders: Order[] }) {
  const [orders, setOrders] = useState(initialOrders);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("ALL");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const filtered = orders.filter((o) => {
    const matchesSearch =
      o.shippingName.toLowerCase().includes(search.toLowerCase()) ||
      o.shippingEmail.toLowerCase().includes(search.toLowerCase()) ||
      o.orderNumber.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = filterStatus === "ALL" || o.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const updateStatus = async (orderId: string, status: string) => {
    try {
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error();
      setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, status: status as any } : o)));
      if (selectedOrder?.id === orderId) setSelectedOrder((prev) => prev ? { ...prev, status: status as any } : null);
      toast.success("Order status updated!");
    } catch {
      toast.error("Failed to update status");
    }
  };

  return (
    <>
      <div className="mb-6">
        <h1 className="font-playfair text-3xl font-bold text-gray-900">Orders</h1>
        <p className="text-gray-500">{orders.length} total orders</p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search orders..."
            className="pl-9 pr-4 py-2.5 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:border-coral w-56"
          />
        </div>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-4 py-2.5 border-2 border-gray-200 rounded-xl text-sm font-semibold focus:outline-none focus:border-coral"
        >
          <option value="ALL">All Status</option>
          {ALL_STATUSES.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="text-left px-4 py-3.5 font-bold text-gray-600">Order #</th>
                <th className="text-left px-4 py-3.5 font-bold text-gray-600 hidden sm:table-cell">Customer</th>
                <th className="text-left px-4 py-3.5 font-bold text-gray-600">Status</th>
                <th className="text-right px-4 py-3.5 font-bold text-gray-600 hidden md:table-cell">Items</th>
                <th className="text-right px-4 py-3.5 font-bold text-gray-600">Total</th>
                <th className="text-right px-4 py-3.5 font-bold text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((order) => (
                <tr key={order.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3.5">
                    <p className="font-bold text-gray-900">#{order.orderNumber.slice(-8).toUpperCase()}</p>
                    <p className="text-gray-400 text-xs">{new Date(order.createdAt).toLocaleDateString()}</p>
                  </td>
                  <td className="px-4 py-3.5 hidden sm:table-cell">
                    <p className="font-medium text-gray-800">{order.shippingName}</p>
                    <p className="text-gray-400 text-xs truncate max-w-[150px]">{order.shippingEmail}</p>
                  </td>
                  <td className="px-4 py-3.5">
                    <select
                      value={order.status}
                      onChange={(e) => updateStatus(order.id, e.target.value)}
                      className={`text-xs font-bold px-2.5 py-1.5 rounded-full border cursor-pointer ${statusColors[order.status] || "bg-gray-100"}`}
                    >
                      {ALL_STATUSES.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </td>
                  <td className="px-4 py-3.5 text-right hidden md:table-cell text-gray-600">
                    {order.orderItems?.length || 0}
                  </td>
                  <td className="px-4 py-3.5 text-right font-playfair font-bold text-gray-900">
                    ${order.total.toFixed(2)}
                  </td>
                  <td className="px-4 py-3.5 text-right">
                    <button
                      onClick={() => setSelectedOrder(order)}
                      className="p-2 hover:bg-blue-50 rounded-lg text-blue-500 transition-colors"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-gray-400 font-medium">
                    No orders found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order detail modal */}
      {selectedOrder && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60"
          onClick={(e) => { if (e.target === e.currentTarget) setSelectedOrder(null); }}
        >
          <div className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <div>
                <h2 className="font-playfair font-bold text-xl text-gray-900">
                  Order #{selectedOrder.orderNumber.slice(-8).toUpperCase()}
                </h2>
                <p className="text-gray-500 text-sm">{new Date(selectedOrder.createdAt).toLocaleString()}</p>
              </div>
              <button onClick={() => setSelectedOrder(null)} className="p-2 hover:bg-gray-100 rounded-xl">
                ✕
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Customer */}
              <div>
                <h3 className="font-bold text-gray-700 text-sm uppercase tracking-wide mb-3">Customer</h3>
                <div className="bg-gray-50 rounded-2xl p-4 space-y-1 text-sm">
                  <p><span className="font-semibold">Name:</span> {selectedOrder.shippingName}</p>
                  <p><span className="font-semibold">Email:</span> {selectedOrder.shippingEmail}</p>
                  <p><span className="font-semibold">Address:</span> {selectedOrder.shippingAddress}, {selectedOrder.shippingCity}, {selectedOrder.shippingCountry}</p>
                </div>
              </div>

              {/* Items */}
              <div>
                <h3 className="font-bold text-gray-700 text-sm uppercase tracking-wide mb-3">Items</h3>
                <div className="space-y-3">
                  {selectedOrder.orderItems?.map((item) => (
                    <div key={item.id} className="flex items-center gap-3 bg-gray-50 rounded-2xl p-3">
                      <img
                        src={item.product?.images?.[0] || "/placeholder.jpg"}
                        alt={item.product?.name}
                        className="w-12 h-12 rounded-xl object-cover"
                      />
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900 text-sm">{item.product?.name}</p>
                        <p className="text-gray-500 text-xs">
                          Qty: {item.quantity} {item.size && `· ${item.size}`} {item.color && `· ${item.color}`}
                        </p>
                      </div>
                      <span className="font-bold text-gray-900">${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Totals */}
              <div className="border-t border-gray-100 pt-4 space-y-2 text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span><span>${selectedOrder.subtotal?.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span><span>${selectedOrder.shipping?.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Tax</span><span>${selectedOrder.tax?.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-900 font-bold text-base pt-2 border-t border-gray-100">
                  <span>Total</span>
                  <span className="font-playfair text-lg">${selectedOrder.total.toFixed(2)}</span>
                </div>
              </div>

              {/* Update status */}
              <div>
                <h3 className="font-bold text-gray-700 text-sm uppercase tracking-wide mb-3">Update Status</h3>
                <div className="flex flex-wrap gap-2">
                  {ALL_STATUSES.map((s) => (
                    <button
                      key={s}
                      onClick={() => updateStatus(selectedOrder.id, s)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                        selectedOrder.status === s
                          ? statusColors[s]
                          : "bg-white text-gray-500 border-gray-200 hover:border-gray-400"
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
