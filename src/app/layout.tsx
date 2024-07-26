import type { Metadata } from "next";
import { Noto_Sans_TC } from "next/font/google";
import React from "react";
import "@/app/globals.css";

const NotoSansTC = Noto_Sans_TC({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "MDTC",
  description: "Mingdao Talent Cloud",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={NotoSansTC.className}>{children}</body>
    </html>
  );
}
