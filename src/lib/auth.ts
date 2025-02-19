// @ts-nocheck

// Third-Party Modules
import NextAuth from "next-auth"
import Google from "next-auth/providers/google"

// @ts-ignore
export const { auth, handlers, signIn, signOut } = NextAuth({
    providers: [Google],
    callbacks: {
        async signIn({ account, profile }) {
            if (account.provider === "google") {
                if (!profile.email.endsWith("@ms.mingdao.edu.tw")) return "/?error=not_md"
                return profile.email_verified
            }
            return true
        },

    },
})