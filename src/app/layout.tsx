import { SessionProvider } from "next-auth/react";
import "@/styles/Global/globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "MDTC",
  description: "Mingdao Talent Cloud",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SessionProvider>
      <html lang="en">
        <body className="[&:has(dialog[open])]:overflow-hidden h-[100dvh] overflow-hidden">
          {children}
        </body>
      </html>
    </SessionProvider>
  );
}