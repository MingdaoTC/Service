import { auth } from "@/library/auth";
import { NextRequest, NextResponse } from "next/server";
import { User, UserRole, AccountStatus } from "./prisma/client";

export async function middleware(request: NextRequest) {
  const session = await auth();
  const user: User = session?.user as User;

  if (!session) {
    return NextResponse.rewrite(new URL("/not-found", request.url));
  }

  if (user.role === UserRole.SUPERADMIN) {
    return NextResponse.next();
  }

  if (request.nextUrl.pathname.startsWith("/admin")) {
    if ((user.role as UserRole) !== UserRole.ADMIN) {
      return NextResponse.rewrite(new URL("/not-found", request.url));
    }
  }

  if (request.nextUrl.pathname.startsWith("/profile")) {
    if (
      user.status !== AccountStatus.VERIFIED ||
      user.role !== UserRole.ALUMNI
    ) {
      return NextResponse.rewrite(new URL("/not-found", request.url));
    }
  }

  if (request.nextUrl.pathname.startsWith("/enterprise")) {
    if (
      user.status !== AccountStatus.VERIFIED ||
      user.role !== UserRole.COMPANY
    ) {
      return NextResponse.rewrite(new URL("/not-found", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/profile/:path*", "/enterprise/:path*"],
};
