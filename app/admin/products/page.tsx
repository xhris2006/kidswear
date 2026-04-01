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

  let products: any[] = [];
  let categories: any[] = [];
  let dbAvailable = true;

  try {
    [products, categories] = await Promise.all([
      prisma.product.findMany({
        include: { category: true },
        orderBy: { createdAt: "desc" },
      }),
      prisma.category.findMany({ orderBy: { name: "asc" } }),
    ]);
  } catch (error) {
    dbAvailable = false;
    console.error("[admin] Failed to load products page", error);
  }

  return (
    <AdminLayout>
      <div className="p-6 sm:p-8">
        {!dbAvailable && (
          <div className="mb-6 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-amber-800">
            Products could not be loaded because the database is temporarily unavailable.
          </div>
        )}
        <AdminProductsClient products={products as any} categories={categories} />
      </div>
    </AdminLayout>
  );
}
