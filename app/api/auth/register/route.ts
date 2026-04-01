// app/api/auth/register/route.ts
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { getRoleForEmail } from "@/lib/roles";
import { Prisma } from "@prisma/client";

export const dynamic = "force-dynamic";

const schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = schema.parse(body);
    const name = parsed.name.trim();
    const email = parsed.email.trim().toLowerCase();
    const password = parsed.password;

    const exists = await prisma.user.findUnique({ where: { email } });
    if (exists) {
      return NextResponse.json({ message: "Email already registered" }, { status: 400 });
    }

    const hashed = await bcrypt.hash(password, 12);
    const user = await prisma.user.create({
      data: { name, email, password: hashed, role: getRoleForEmail(email) },
      select: { id: true, email: true, name: true, role: true },
    });

    return NextResponse.json(user, { status: 201 });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ message: err.errors[0].message }, { status: 400 });
    }
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2002") {
      return NextResponse.json({ message: "Email already registered" }, { status: 400 });
    }
    if (err instanceof Prisma.PrismaClientInitializationError) {
      console.error("[auth] Register DB init failed", err);
      return NextResponse.json(
        { message: "Database connection failed. Please verify your Supabase/Vercel env settings." },
        { status: 503 }
      );
    }
    console.error("[auth] Register failed", err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
