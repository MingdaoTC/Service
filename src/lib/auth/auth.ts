// @ts-nocheck

// modules
import { UserRole } from "@/prisma/client";
import NextAuth from "next-auth";
import Google from "next-auth/providers/google";

export const { auth, handlers, signIn, signOut } = NextAuth({
  providers: [Google],
  callbacks: {
    async signIn({ account, _profile }) {
      if (account.provider === "google") {
        return true;
      }
      return true;
    },
    async session({ session, _token }) {
      const defaultData = {
        username:`${session.user.email.split("@")[0]}_${session.user.email.split("@")[1]}`,
        displayName: session.user.name,
        email: session.user.email,
        avatarUrl: session.user.image,
      }

      const data = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/user`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(defaultData),
      })
      const user = (await data.json()).data;

      return { user: user };
    },
    authorized: async ({ auth }) => {
      console.log("Auth:", auth);
      if (auth) {
        if (auth.user.role === UserRole.ADMIN || auth.user.role === UserRole.SUPERADMIN) {
          return true;
        }
        return false;
      }
    },
  },
  session: {
    strategy: "jwt",
  },
});
