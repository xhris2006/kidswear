// app/api/admin/products/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

async function checkAdmin() {
  const session = await auth();
  return session && (session.user as any)?.role === "ADMIN" ? session : null;
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  if (!(await checkAdmin()))
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  try {
    const body = await req.json();
    const product = await prisma.product.update({
      where: { id: params.id },
      data: body,
      include: { category: true },
    });
    return NextResponse.json(product);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}

export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  if (!(await checkAdmin()))
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  try {
    await prisma.product.delete({ where: { id: params.id } });
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
