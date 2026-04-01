// app/admin/products/page.tsx
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import AdminLayout from "@/components/admin/AdminLayout";
import AdminProductsClient from "@/components/admin/AdminProductsClient";
import { isAdminRole } from "@/lib/roles";

export default async function AdminProductsPage() {
  const session = await auth();
  if (!session || !isAdminRole((session.user as any)?.role)) redirect("/auth/login");

  const [products, categories] = await Promise.all([
    prisma.product.findMany({
      include: { category: true },
      orderBy: { createdAt: "desc" },
    }),
    prisma.category.findMany({ orderBy: { name: "asc" } }),
  ]);

  return (
    <AdminLayout>
      <div className="p-6 sm:p-8">
        <AdminProductsClient products={products as any} categories={categories} />
      </div>
    </AdminLayout>
  );
}
