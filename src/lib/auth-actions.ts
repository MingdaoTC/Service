"use server";

import { signIn as nextAuthSignIn, signOut as nextAuthSignOut } from "@/lib/auth";

export async function handleSignIn() {
  await nextAuthSignIn("google");
}

export async function handleSignOut() {
  await nextAuthSignOut();
}