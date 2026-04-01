// app/admin/dashboard/page.tsx
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import AdminLayout from "@/components/admin/AdminLayout";
import StatsCard from "@/components/admin/StatsCard";
import RecentOrdersTable from "@/components/admin/RecentOrdersTable";
import { ShoppingBag, Users, Package, DollarSign, TrendingUp } from "lucide-react";
import { isAdminRole } from "@/lib/roles";

async function getStats() {
  const [
    totalOrders,
    totalUsers,
    totalProducts,
    revenueResult,
    recentOrders,
    topProducts,
  ] = await Promise.all([
    prisma.order.count(),
    prisma.user.count(),
    prisma.product.count(),
    prisma.order.aggregate({
      _sum: { total: true },
      where: { status: { in: ["PAID", "SHIPPED", "DELIVERED"] } },
    }),
    prisma.order.findMany({
      include: {
        user: true,
        orderItems: { include: { product: true } },
      },
      orderBy: { createdAt: "desc" },
      take: 8,
    }),
    prisma.product.findMany({
      include: {
        _count: { select: { orderItems: true } },
        category: true,
      },
      orderBy: { reviewCount: "desc" },
      take: 5,
    }),
  ]);

  return {
    totalOrders,
    totalUsers,
    totalProducts,
    totalRevenue: revenueResult._sum.total || 0,
    recentOrders,
    topProducts,
  };
}

export default async function AdminDashboard() {
  const session = await auth();
  if (!session || !isAdminRole((session.user as any)?.role)) {
    redirect("/auth/login");
  }

  const stats = await getStats();

  const statCards = [
    {
      title: "Total Revenue",
      value: `$${stats.totalRevenue.toFixed(2)}`,
      icon: DollarSign,
      color: "bg-green-100 text-green-600",
      trend: "+12.5%",
    },
    {
      title: "Total Orders",
      value: stats.totalOrders.toString(),
      icon: ShoppingBag,
      color: "bg-blue-100 text-blue-600",
      trend: "+8.2%",
    },
    {
      title: "Products",
      value: stats.totalProducts.toString(),
      icon: Package,
      color: "bg-purple-100 text-purple-600",
      trend: "+3",
    },
    {
      title: "Customers",
      value: stats.totalUsers.toString(),
      icon: Users,
      color: "bg-orange-100 text-orange-600",
      trend: "+24",
    },
  ];

  return (
    <AdminLayout>
      <div className="p-6 sm:p-8">
        <div className="mb-8">
          <h1 className="font-playfair text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500 mt-1">Welcome back, {session.user?.name}! Here&apos;s what&apos;s happening.</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {statCards.map((card) => (
            <StatsCard key={card.title} {...card} />
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Recent Orders */}
          <div className="lg:col-span-2">
            <h2 className="font-bold text-xl text-gray-900 mb-4">Recent Orders</h2>
            <RecentOrdersTable orders={stats.recentOrders as any} />
          </div>

          {/* Top Products */}
          <div>
            <h2 className="font-bold text-xl text-gray-900 mb-4">Top Products</h2>
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              {stats.topProducts.map((product, i) => (
                <div
                  key={product.id}
                  className="flex items-center gap-3 p-4 border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors"
                >
                  <span className="w-6 h-6 bg-pink-100 text-pink-600 rounded-full text-xs font-bold flex items-center justify-center flex-shrink-0">
                    {i + 1}
                  </span>
                  <img
                    src={product.images[0] || "/placeholder.jpg"}
                    alt={product.name}
                    className="w-10 h-10 rounded-xl object-cover flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 text-sm truncate">{product.name}</p>
                    <p className="text-gray-500 text-xs">{product._count.orderItems} orders</p>
                  </div>
                  <span className="font-bold text-gray-900 text-sm">${product.price}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
