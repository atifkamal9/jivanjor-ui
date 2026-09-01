import type { Metadata } from "next";
import { Geist, Geist_Mono, Google_Sans, Amethysta } from "next/font/google";
import Script from "next/script";
import "./globals.css";

import { Footer, Navbar } from "@/components/layouts";
import { api } from "@/lib/api";
import ScriptRenderer from "@/components/common/ScriptRenderer";

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

const DEFAULT_GTAG = `<!-- Google tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-JS98QGT5QS"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());

  gtag('config', 'G-JS98QGT5QS');
</script>`;

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const settings = await api.getSettings().catch(() => null);
  const headScripts = settings?.scriptConfig?.headScripts?.trim()
    ? settings.scriptConfig.headScripts
    : DEFAULT_GTAG;
  const bodyScripts = settings?.scriptConfig?.bodyScripts || "";
  const footerScripts = settings?.scriptConfig?.footerScripts || "";

  return (
    <html
      lang="en"
      className={`${googleSans.variable} ${amethysta.variable} h-full antialiased`}
    >
      <head />
      <body className="min-h-full flex flex-col overflow-x-hidden">
        {/* Dynamic Head, Body, and Footer Analytics & GTM Scripts */}
        <ScriptRenderer
          headScripts={headScripts}
          bodyScripts={bodyScripts}
          footerScripts={footerScripts}
        />

        {/* Server-side fallback for noscript tags (e.g. GTM noscript iframe) */}
        {bodyScripts && (
          <div
            id="ssr-body-scripts"
            className="hidden"
            dangerouslySetInnerHTML={{
              __html: bodyScripts,
            }}
          />
        )}

        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
