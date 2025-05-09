import AuthWrapperClient from "@/components/Auth";
import { auth } from "@/library/auth";
import { User } from "@/prisma/client";
import React from "react";

export default async function AuthPage({
  children,
}: { children: React.ReactNode }) {
  // 在服務端執行身份驗證檢查
  const session = await auth();
  //@ts-ignore
  const user: User | null = session?.user || null;

  return (
    <AuthWrapperClient isAuthenticated={!!user} user={user}>
      {children}
    </AuthWrapperClient>
  );
}
