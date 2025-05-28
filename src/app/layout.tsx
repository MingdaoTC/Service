import { SessionProvider } from "next-auth/react";
import "@/styles/Global/globals.css";
import type { Viewport } from "next";
import type { Metadata } from "next";

export const metadata: Metadata = {
  metadataBase: new URL("https://tc.mingdao.edu.tw"),
  title: "明道人才雲",
  description: "明道人才雲是專為明道校友及校友企業打造的專業就業媒合平台。我們致力於建立強而有力的校友網絡，為畢業校友提供優質的職涯發展機會，同時協助校友企業找到最適合的人才。",
  applicationName: "明道人才雲",
  authors: [{ name: "HACO, Lazp, OnCloud, Meru" }],
  keywords: ["MDTC", "Talent", "Cloud", "Mingdao", "Talent Cloud", "Alumni", "Mingdao High School", "明道人才雲", "明道高級中學", "明道校友", "校友企業"],
  creator: "LAZCO STUDIO LTD",
  publisher: "Mingdao High School",
  icons: [{ rel: "icon", url: "https://tc.mingdao.edu.tw/favicon.ico" }, { rel: "apple-touch-icon", url: "https://tc.mingdao.edu.tw/favicon.ico" }],
  openGraph: {
    type: "website",
    url: "https://tc.mingdao.edu.tw",
    title: "明道人才雲 - 打造理想職涯",
    description: "明道人才雲是專為明道校友及校友企業打造的專業就業媒合平台。我們致力於建立強而有力的校友網絡，為畢業校友提供優質的職涯發展機會，同時協助校友企業找到最適合的人才。",
    images: [{
      url: "https://tc.mingdao.edu.tw/images/banner.jpg",
    }],
  },
  twitter: {
    title: "明道人才雲 - 打造理想職涯",
    description: "明道人才雲是專為明道校友及校友企業打造的專業就業媒合平台。我們致力於建立強而有力的校友網絡，為畢業校友提供優質的職涯發展機會，同時協助校友企業找到最適合的人才。",
    card: "summary_large_image",
    images: "https://tc.mingdao.edu.tw/images/banner.jpg"
  },
  other: {
    "twitter:url": "https://tc.mingdao.edu.tw"
  }
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

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#f1f5f9",
};
