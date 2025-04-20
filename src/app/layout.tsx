// Module
import React from "react";
import { SessionProvider } from "next-auth/react";

// Type
import type { Metadata } from "next";

// Style
import "@/styles/Global/globals.css";
import { Noto_Sans_TC } from "next/font/google";

// Component
import HeaderBar from "@/components/Global/Header/HeaderBar";
import Footer from "@/components/Global/Footer";

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
    <SessionProvider>
      <html lang="en">
        <body
          className={
            NotoSansTC.className + " [&:has(dialog[open])]:overflow-hidden h-[100dvh] overflow-hidden"
          }
        >
          <HeaderBar />
          <div className="h-[calc(100vh-3rem)] overflow-auto">
            <div className="h-auto min-h-[calc(100%-3rem)]">
              {children}
            </div>
            <Footer />
          </div>
        </body>
      </html>
    </SessionProvider>
  );
}
