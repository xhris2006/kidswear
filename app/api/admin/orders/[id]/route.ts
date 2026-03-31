// app/api/admin/orders/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

async function checkAdmin() {
  const session = await auth();
  return session && (session.user as any)?.role === "ADMIN" ? session : null;
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  if (!(await checkAdmin()))
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  try {
    const { status } = await req.json();
    const order = await prisma.order.update({
      where: { id: params.id },
      data: { status },
      include: { user: true, orderItems: { include: { product: true } } },
    });
    return NextResponse.json(order);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
