// app/admin/orders/page.tsx
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import AdminLayout from "@/components/admin/AdminLayout";
import AdminOrdersClient from "@/components/admin/AdminOrdersClient";
import { isAdminRole } from "@/lib/roles";

export default async function AdminOrdersPage() {
  const session = await auth();
  if (!session || !isAdminRole((session.user as any)?.role)) redirect("/auth/login");

  let orders: any[] = [];
  let dbAvailable = true;

  try {
    orders = await prisma.order.findMany({
      include: {
        user: true,
        orderItems: { include: { product: true } },
      },
      orderBy: { createdAt: "desc" },
    });
  } catch (error) {
    dbAvailable = false;
    console.error("[admin] Failed to load orders page", error);
  }

  return (
    <AdminLayout>
      <div className="p-6 sm:p-8">
        {!dbAvailable && (
          <div className="mb-6 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-amber-800">
            Orders could not be loaded because the database is temporarily unavailable.
          </div>
        )}
        <AdminOrdersClient orders={orders as any} />
      </div>
    </AdminLayout>
  );
}
