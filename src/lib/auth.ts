// @ts-nocheck

// Third-Party Modules
import NextAuth from "next-auth";
import Google from "next-auth/providers/google";

// Lib
import { prisma } from "@/lib/prisma";

export const { auth, handlers, signIn, signOut } = NextAuth({
  providers: [Google],
  callbacks: {
    async signIn({ account, profile }) {
      if (account.provider === "google") {
        return true;
      }
      return true;
    },
    async session({ session, token }) {
      console.log(session, token);
      // await prisma.user.
      // We should return user data here for frontend to use.
      return token;
    },
  },
  session: {
    strategy: "jwt",
  },
});