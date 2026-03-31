// app/admin/users/page.tsx
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import AdminLayout from "@/components/admin/AdminLayout";
import AdminUsersClient from "@/components/admin/AdminUsersClient";

export default async function AdminUsersPage() {
  const session = await auth();
  if (!session || (session.user as any)?.role !== "ADMIN") redirect("/auth/login");

  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      image: true,
      createdAt: true,
      _count: { select: { orders: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <AdminLayout>
      <div className="p-6 sm:p-8">
        <AdminUsersClient users={users as any} currentUserId={(session.user as any).id} />
      </div>
    </AdminLayout>
  );
}
