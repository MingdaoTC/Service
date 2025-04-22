import { auth } from "@/lib/auth/auth";
import { User, UserRole } from "./prisma/client";

export default auth((req) => {
  const user = req.auth?.user as User;
  if (
    (user.role as UserRole) !== UserRole.ADMIN &&
    user.role !== UserRole.SUPERADMIN
  ) {
    return Response.redirect(new URL("/", req.url));
  }
});

export const config = {
  matcher: ["/admin", "/admin/:path*"],
};
