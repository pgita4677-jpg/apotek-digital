import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  const { pathname } = req.nextUrl;

  // ✅ HALAMAN PUBLIK (BEBAS DIAKSES)
  if (
    pathname.startsWith("/login") ||
    pathname.startsWith("/register") ||
    pathname.startsWith("/api")
  ) {
    return NextResponse.next();
  }

  // ❌ BELUM LOGIN → TOLAK
  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}

// 👇 halaman internal saja
export const config = {
  matcher: [
    "/dashboard/:path*",
    "/obat/:path*",
    "/transaksi/:path*",
    "/laporan/:path*",
  ],
};
