// app/admin/users/page.tsx
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import AdminLayout from "@/components/admin/AdminLayout";
import AdminUsersClient from "@/components/admin/AdminUsersClient";
import { canManageRoles } from "@/lib/roles";

export default async function AdminUsersPage() {
  const session = await auth();
  if (!session || !canManageRoles((session.user as any)?.role)) redirect("/admin/dashboard");

  let users: any[] = [];
  let dbAvailable = true;

  try {
    users = await prisma.user.findMany({
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
  } catch (error) {
    dbAvailable = false;
    console.error("[admin] Failed to load users page", error);
  }

  return (
    <AdminLayout>
      <div className="p-6 sm:p-8">
        {!dbAvailable && (
          <div className="mb-6 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-amber-800">
            Users could not be loaded because the database is temporarily unavailable.
          </div>
        )}
        <AdminUsersClient
          users={users as any}
          currentUserId={(session.user as any).id}
          currentUserRole={(session.user as any).role}
        />
      </div>
    </AdminLayout>
  );
}
