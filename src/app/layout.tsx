import type { Metadata, Viewport } from "next";
import { Anton, Onest } from "next/font/google";

import {
  generateMetadata,
  generateViewport,
} from "@/utils/seo/generate-page-metadata";
import { getSiteStructuredData } from "@/utils/seo/structured-data";

import { LazyCookie } from "@/components/common/Cookie";
import { CONSENT_FLAG_SCRIPT } from "@/components/common/Cookie/consent-flag";
import { AdaptiveGrid } from "@/components/common/grid";
import { JsonLd } from "@/components/common/json-ld";
import { originSyncScript } from "@/components/common/origin-sync";
import { ReducedMotion } from "@/components/common/reduced-motion";
import { Backdrop } from "@/components/site/backdrop";
import { CartDrawer } from "@/components/site/cart-drawer";
import { Cursor } from "@/components/site/cursor";
import { FlavorTheme } from "@/components/site/flavor-theme";
import { Nav } from "@/components/site/nav";
import { ScrollLayout } from "@/layouts/scroll-layout";
import { siteConfig } from "@/lib/site";

import "@/app/globals.css";

const onest = Onest({
  variable: "--font-onest",
  subsets: ["latin"],
  display: "swap",
});

const anton = Anton({
  variable: "--font-anton",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

export const metadata: Metadata = generateMetadata();
export const viewport: Viewport = generateViewport();

/**
 * The root layout. Keep it static: nothing here (or in any page) may read
 * `headers()` / `cookies()` — that renders every route per request. Robots are
 * told apart in `src/proxy.ts` instead (obsidian/frontend/robot-form.md).
 *
 * There is deliberately no `app/loading.tsx`: even one that returns `null`
 * wraps the page in a Suspense boundary, and the server then streams the whole
 * page inside `<div hidden>` — crawlers that don't run JS (most AI crawlers)
 * read a page whose content is hidden. Add a loading state per route, only
 * with a real skeleton.
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // `data-consent` is set on <html> by CONSENT_FLAG_SCRIPT before hydration.
    <html
      lang={siteConfig.locale.split("_")[0]}
      data-flavor="blueberry"
      suppressHydrationWarning
    >
      <body
        className={`${onest.variable} ${anton.variable} bg-background font-sans text-foreground transition-colors duration-[var(--duration-slow)] ease-entrance`}
      >
        {/* Before anything is parsed: marks a returning visitor's choice so the
            server-rendered consent banner is hidden before its first paint. */}
        <script dangerouslySetInnerHTML={{ __html: CONSENT_FLAG_SCRIPT }} />
        {/* Canonical + share URLs follow the origin serving the page. */}
        <script
          dangerouslySetInnerHTML={{ __html: originSyncScript(siteConfig.url) }}
        />
        <JsonLd data={getSiteStructuredData()} />
        <ScrollLayout>
          <AdaptiveGrid />
          <ReducedMotion />
          <FlavorTheme />
          <Backdrop />
          <Nav />
          <CartDrawer />
          <Cursor />
          <LazyCookie />
          {children}
        </ScrollLayout>
      </body>
    </html>
  );
}
