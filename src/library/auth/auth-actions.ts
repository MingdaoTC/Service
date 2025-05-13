"use server";

import {
  signIn as nextAuthSignIn,
  signOut as nextAuthSignOut,
} from "@/library/auth";

export async function handleSignIn() {
  await nextAuthSignIn("google");
}

export async function handleSignOut() {
  await nextAuthSignOut();
}
