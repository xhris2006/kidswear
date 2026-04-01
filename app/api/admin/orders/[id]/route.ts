// app/api/admin/orders/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { isAdminRole } from "@/lib/roles";

type RouteContext = {
  params: Promise<{ id: string }>;
};

async function checkAdmin() {
  const session = await auth();
  return session && isAdminRole((session.user as any)?.role) ? session : null;
}

export async function PATCH(req: NextRequest, { params }: RouteContext) {
  if (!(await checkAdmin()))
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  try {
    const { id } = await params;
    const { status } = await req.json();
    const order = await prisma.order.update({
      where: { id },
      data: { status },
      include: { user: true, orderItems: { include: { product: true } } },
    });
    return NextResponse.json(order);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
