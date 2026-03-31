// components/admin/RecentOrdersTable.tsx
import { Order } from "@/types";
import Link from "next/link";

const statusColors: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-700",
  PAID: "bg-blue-100 text-blue-700",
  PROCESSING: "bg-purple-100 text-purple-700",
  SHIPPED: "bg-indigo-100 text-indigo-700",
  DELIVERED: "bg-green-100 text-green-700",
  CANCELLED: "bg-red-100 text-red-700",
  REFUNDED: "bg-gray-100 text-gray-700",
};

export default function RecentOrdersTable({ orders }: { orders: Order[] }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50">
              <th className="text-left px-4 py-3.5 font-bold text-gray-600">Order</th>
              <th className="text-left px-4 py-3.5 font-bold text-gray-600 hidden sm:table-cell">Customer</th>
              <th className="text-left px-4 py-3.5 font-bold text-gray-600">Status</th>
              <th className="text-right px-4 py-3.5 font-bold text-gray-600">Total</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3.5">
                  <Link
                    href={`/admin/orders?id=${order.id}`}
                    className="font-semibold text-gray-900 hover:text-coral"
                    style={{ "--hover-color": "#FF6B6B" } as any}
                  >
                    #{order.orderNumber.slice(-8).toUpperCase()}
                  </Link>
                  <p className="text-gray-400 text-xs mt-0.5">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </td>
                <td className="px-4 py-3.5 hidden sm:table-cell">
                  <p className="font-medium text-gray-800">{order.shippingName}</p>
                  <p className="text-gray-400 text-xs truncate max-w-[150px]">{order.shippingEmail}</p>
                </td>
                <td className="px-4 py-3.5">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${statusColors[order.status] || "bg-gray-100 text-gray-600"}`}>
                    {order.status}
                  </span>
                </td>
                <td className="px-4 py-3.5 text-right font-playfair font-bold text-gray-900">
                  ${order.total.toFixed(2)}
                </td>
              </tr>
            ))}
            {orders.length === 0 && (
              <tr>
                <td colSpan={4} className="text-center py-12 text-gray-400 font-medium">
                  No orders yet
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="px-4 py-3 border-t border-gray-100">
        <Link href="/admin/orders" className="text-sm font-bold hover:underline" style={{ color: "#FF6B6B" }}>
          View all orders →
        </Link>
      </div>
    </div>
  );
}
