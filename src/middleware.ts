// middleware.ts
import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
  // 獲取 JWT token
  const token = await getToken({ 
    req: request,
    secret: process.env.AUTH_SECRET
  });
  
  const isAdminRoute = request.nextUrl.pathname.startsWith("/admin");

  if (isAdminRoute) {
    try {
      const userResponse = await fetch(`${request.nextUrl.origin}/api/check-admin`, {
        headers: {
          cookie: request.headers.get("cookie") || "",
          "Content-Type": "application/json",
        },
        method: "GET",
      });
      
      if (!userResponse.ok) {
        return NextResponse.rewrite(new URL("/not-found", request.url));
      }
      
      const userData = await userResponse.json();
      
      if (!userData.isAdmin) {
        return NextResponse.rewrite(new URL("/not-found", request.url));
      }
    } catch (error) {
      console.error("Error checking admin status:", error);
      return NextResponse.rewrite(new URL("/not-found", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin", "/admin/:path*"],
};