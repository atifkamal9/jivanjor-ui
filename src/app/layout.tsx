import type { Metadata } from "next";
import { Geist, Geist_Mono, Google_Sans, Amethysta } from "next/font/google";
import "./globals.css";

import { Footer, Navbar } from "@/components/layouts";
import { api } from "@/lib/api";
import SsrHeadRenderer, { SsrHtmlRenderer, DEFAULT_HEAD_SCRIPTS } from "@/components/common/SsrHeadRenderer";

export const dynamic = "force-dynamic";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const googleSans = Google_Sans({
  variable: "--font-google-sans",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

const amethysta = Amethysta({
  variable: "--font-amethysta",
  subsets: ["latin"],
  weight: ["400"],
});

export const metadata: Metadata = {
  title: "Jivanjor",
  description: "Jivanjor",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const settings = await api.getSettings().catch(() => null);
  const headScripts = settings?.scriptConfig?.headScripts?.trim()
    ? settings.scriptConfig.headScripts
    : DEFAULT_HEAD_SCRIPTS;
  const bodyScripts = settings?.scriptConfig?.bodyScripts || "";
  const footerScripts = settings?.scriptConfig?.footerScripts || "";

  return (
    <html
      lang="en"
      className={`${googleSans.variable} ${amethysta.variable} h-full antialiased`}
    >
      <head>
        {/* Dynamic SSR Head Tags (Google/Bing/Other verification meta tags, custom head scripts, link tags) */}
        <SsrHeadRenderer html={headScripts} />
      </head>
      <body className="min-h-full flex flex-col overflow-x-hidden">
        {/* Dynamic SSR Body Scripts (e.g. GTM noscript iframe, top-of-body scripts) */}
        {bodyScripts && <SsrHtmlRenderer html={bodyScripts} location="body" />}
        <Navbar />
        {children}
        <Footer />
        {/* Dynamic SSR Footer Scripts (e.g. live chat widgets, analytics, conversion scripts) */}
        {footerScripts && <SsrHtmlRenderer html={footerScripts} location="footer" />}
      </body>
    </html>
  );
}
