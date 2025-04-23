import { auth } from "@/lib/auth/auth";
import { User, UserRole } from "./prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  const session = await auth();
  const user: User = session?.user as User;

  if (!session) {
    return NextResponse.rewrite(new URL("/not-found", request.url));
  }

  if (
    (user.role as UserRole) !== UserRole.ADMIN &&
    user.role !== UserRole.SUPERADMIN
  ) {
    return NextResponse.rewrite(new URL("/not-found", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin", "/admin/:path*"],
};
