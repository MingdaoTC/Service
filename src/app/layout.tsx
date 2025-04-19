// Module
import React from "react";

// Type
import type { Metadata } from "next";

// Style
import "@/styles/Global/globals.css";
import { Noto_Sans_TC } from "next/font/google";

// Component
import HeaderBar from "@/components/Global/Header/HeaderBar";

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
      <body
        className={
          NotoSansTC.className + " [&:has(dialog[open])]:overflow-hidden"
        }
      >
        <HeaderBar />
        {children}
      </body>
    </html>
  );
}
