// app/api/admin/stats/route.ts
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await auth();
  if (!session || (session.user as any)?.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const [
    totalOrders,
    totalUsers,
    totalProducts,
    revenueResult,
    ordersByStatus,
  ] = await Promise.all([
    prisma.order.count(),
    prisma.user.count(),
    prisma.product.count(),
    prisma.order.aggregate({
      _sum: { total: true },
      where: { status: { in: ["PAID", "SHIPPED", "DELIVERED"] } },
    }),
    prisma.order.groupBy({
      by: ["status"],
      _count: true,
    }),
  ]);

  return NextResponse.json({
    totalOrders,
    totalUsers,
    totalProducts,
    totalRevenue: revenueResult._sum.total || 0,
    ordersByStatus,
  });
}
