import { SessionProvider } from "next-auth/react";
// Module
import React from "react";

// Type
import type { Metadata } from "next";

// Style
import "@/styles/Global/globals.css";

import Footer from "@/components/Global/Footer";
// Component
import HeaderBar from "@/components/Global/Header/HeaderBar";

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
          className={`[&:has(dialog[open])]:overflow-hidden h-[100dvh] overflow-hidden`}
        >
          <HeaderBar />
          <div className="h-[calc(100dvh-3rem)] flex flex-col overflow-auto">
            <div className="flex-1 overflow-auto min-h-[calc(100dvh-6rem)]">{children}</div>
            <Footer />
          </div>
        </body>
      </html>
    </SessionProvider>
  );
}
