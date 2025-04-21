// // middleware.ts
// import { NextResponse } from "next/server";
// import { NextRequest } from "next/server";

// export async function middleware(request: NextRequest) {
//   const isAdminRoute = request.nextUrl.pathname.startsWith("/admin");

//   if (isAdminRoute) {
//     try {
//       const userResponse = await fetch(`${request.nextUrl.origin}/api/check-admin`, {
//         headers: {
//           "Content-Type": "application/json",
//         },
//         method: "GET",
//       });
      
//       const userData = await userResponse.json();
//       console.log("User Data:", userData);
      
//       if (!userData.isAdmin) {
//         return NextResponse.rewrite(new URL("/not-found", request.url));
//       }
//     } catch (error) {
//       console.error("Error checking admin status:", error);
//       return NextResponse.rewrite(new URL("/not-found", request.url));
//     }
//   }

//   return NextResponse.next();
// }

// export const config = {
//   matcher: ["/admin", "/admin/:path*"],
// };

import { auth } from "@/lib/auth/auth";
 
export default auth((req) => {
  console.log(req);
  // if (!req.auth && req.nextUrl.pathname !== "/login") {
  //   const newUrl = new URL("/login", req.nextUrl.origin);
  //   return Response.redirect(newUrl);
  // }
});

export const config = {
  matcher: ["/admin", "/admin/:path*"],
};