// app/admin/orders/page.tsx
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import AdminLayout from "@/components/admin/AdminLayout";
import AdminOrdersClient from "@/components/admin/AdminOrdersClient";

export default async function AdminOrdersPage() {
  const session = await auth();
  if (!session || (session.user as any)?.role !== "ADMIN") redirect("/auth/login");

  const orders = await prisma.order.findMany({
    include: {
      user: true,
      orderItems: { include: { product: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <AdminLayout>
      <div className="p-6 sm:p-8">
        <AdminOrdersClient orders={orders as any} />
      </div>
    </AdminLayout>
  );
}
