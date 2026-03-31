// app/shop/orders/page.tsx
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Link from "next/link";
import { ShoppingBag, Package, CheckCircle } from "lucide-react";

const statusColors: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-700",
  PAID: "bg-blue-100 text-blue-700",
  PROCESSING: "bg-purple-100 text-purple-700",
  SHIPPED: "bg-indigo-100 text-indigo-700",
  DELIVERED: "bg-green-100 text-green-700",
  CANCELLED: "bg-red-100 text-red-700",
  REFUNDED: "bg-gray-100 text-gray-700",
};

export default async function OrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ success?: string }>;
}) {
  const session = await auth();
  if (!session) redirect("/auth/login?redirect=/shop/orders");
  const { success } = await searchParams;

  const orders = await prisma.order.findMany({
    where: { userId: (session.user as any).id },
    include: { orderItems: { include: { product: true } } },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {success && (
          <div className="bg-green-50 border border-green-200 rounded-2xl p-5 mb-8 flex items-center gap-4">
            <CheckCircle className="w-8 h-8 text-green-500 flex-shrink-0" />
            <div>
              <p className="font-bold text-green-800 text-lg">Order Placed Successfully! 🎉</p>
              <p className="text-green-600 text-sm">We&apos;ll send a confirmation email shortly.</p>
            </div>
          </div>
        )}

        <h1 className="font-playfair text-3xl sm:text-4xl font-bold text-gray-900 mb-8">My Orders</h1>

        {orders.length === 0 ? (
          <div className="text-center py-24">
            <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h2 className="font-bold text-xl text-gray-700 mb-2">No orders yet</h2>
            <p className="text-gray-500 mb-6">Start shopping and your orders will appear here.</p>
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 text-white font-bold px-6 py-3 rounded-2xl"
              style={{ backgroundColor: "#FF6B6B" }}
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-5">
            {orders.map((order) => (
              <div key={order.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="flex items-center justify-between p-5 border-b border-gray-100 flex-wrap gap-3">
                  <div>
                    <p className="font-bold text-gray-900">
                      Order #{order.orderNumber.slice(-8).toUpperCase()}
                    </p>
                    <p className="text-gray-500 text-sm">
                      {new Date(order.createdAt).toLocaleDateString("en-US", {
                        year: "numeric", month: "long", day: "numeric",
                      })}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${statusColors[order.status]}`}>
                      {order.status}
                    </span>
                    <span className="font-playfair font-bold text-lg text-gray-900">
                      ${order.total.toFixed(2)}
                    </span>
                  </div>
                </div>
                <div className="p-5">
                  <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                    {order.orderItems.map((item) => (
                      <div key={item.id} className="flex-shrink-0 flex items-center gap-3 bg-gray-50 rounded-xl p-3 min-w-[200px]">
                        <img
                          src={item.product?.images?.[0] || "/placeholder.jpg"}
                          alt={item.product?.name}
                          className="w-12 h-12 rounded-xl object-cover"
                        />
                        <div>
                          <p className="font-semibold text-gray-900 text-sm line-clamp-1">{item.product?.name}</p>
                          <p className="text-gray-500 text-xs">
                            x{item.quantity} · ${(item.price * item.quantity).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
