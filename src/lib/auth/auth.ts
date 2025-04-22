// @ts-nocheck

// Third-Party Modules
import NextAuth from "next-auth";
import Google from "next-auth/providers/google";

// Lib
import { findUser } from "@/lib/db/user/find";
import { createUser } from "@/lib/db/user/create";

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
      let user = await findUser({ email: session.user.email });

      if (!user) {
        user = await createUser({
          username:`${session.user.email.split("@")[0]}_${session.user.email.split("@")[1]}`,
          displayName: session.user.name,
          email: session.user.email,
          avatarUrl: session.user.image,
        });
      }

      return { user: user };
    },
  },
  session: {
    strategy: "jwt",
  },
});
