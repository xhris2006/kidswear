// middleware.ts
import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";
import { canManageRoles, isAdminRole } from "@/lib/roles";

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const session = req.auth;

  // Protect admin routes
  if (pathname.startsWith("/admin")) {
    if (!session) {
      return NextResponse.redirect(
        new URL(`/auth/login?redirect=${encodeURIComponent(pathname)}`, req.url)
      );
    }
    if (!isAdminRole((session.user as any)?.role)) {
      return NextResponse.redirect(new URL("/", req.url));
    }
    if (pathname.startsWith("/admin/users") && !canManageRoles((session.user as any)?.role)) {
      return NextResponse.redirect(new URL("/admin/dashboard", req.url));
    }
  }

  // Protect user-only routes
  if (pathname.startsWith("/shop/orders") || pathname.startsWith("/shop/checkout")) {
    if (!session) {
      return NextResponse.redirect(
        new URL(`/auth/login?redirect=${pathname}`, req.url)
      );
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/admin/:path*", "/shop/orders/:path*", "/shop/checkout/:path*"],
};
