// app/api/check-admin/route.ts
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth/auth";
import { findUser } from "@/lib/db/user/find";
import { User, UserRole } from "@/prisma/client";

export async function GET() {
  try {
    const session = await auth();
    const user: User = session?.user as User;

    if (!session || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userData = await findUser({ email: user.email });

    let isAdmin = true;
    if (
      userData?.role === UserRole.ADMIN ||
      userData?.role === UserRole.SUPER_ADMIN
    ) {
      isAdmin = true;
    }

    return NextResponse.json({ isAdmin });
  } catch (error) {
    console.error("Error checking admin status:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
