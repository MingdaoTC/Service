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
        console.log(account, profile)
        return true
      }
      return true;
    },
  },
  session: {
    strategy: "jwt"
  },
});