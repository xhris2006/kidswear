// app/api/admin/users/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Role } from "@prisma/client";
import { canManageRoles, isSuperAdminRole } from "@/lib/roles";

type RouteContext = {
  params: Promise<{ id: string }>;
};

async function checkAdmin() {
  const session = await auth();
  return session && canManageRoles((session.user as any)?.role) ? session : null;
}

export async function PATCH(req: NextRequest, { params }: RouteContext) {
  const session = await checkAdmin();
  if (!session) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  try {
    const { id } = await params;
    const { role } = await req.json();
    if (id === (session.user as any)?.id) {
      return NextResponse.json({ error: "Cannot change your own role" }, { status: 403 });
    }
    if (role !== Role.USER && role !== Role.ADMIN) {
      return NextResponse.json({ error: "Invalid role" }, { status: 400 });
    }

    const targetUser = await prisma.user.findUnique({
      where: { id },
      select: { role: true },
    });

    if (!targetUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (isSuperAdminRole(targetUser.role)) {
      return NextResponse.json({ error: "Cannot modify a super admin" }, { status: 403 });
    }

    const user = await prisma.user.update({
      where: { id },
      data: { role },
      select: { id: true, name: true, email: true, role: true },
    });
    return NextResponse.json(user);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
