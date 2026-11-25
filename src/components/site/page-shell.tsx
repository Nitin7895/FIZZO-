import type { ReactNode } from "react";

import { JsonLd } from "@/components/common/json-ld";
import { getBreadcrumbStructuredData, jsonLdGraph } from "@/utils/seo/structured-data";

import { Footer } from "./footer";

interface PageShellProps {
  children: ReactNode;
  /** The route's path — adds its breadcrumb JSON-LD. */
  path: `/${string}`;
  className?: string;
}

/** Every inner page: the content column, then the footer. The nav lives in the layout. */
export const PageShell = ({ children, path, className = "" }: PageShellProps) => {
  const breadcrumb = getBreadcrumbStructuredData(path);
  return (
    <>
      {breadcrumb && <JsonLd data={jsonLdGraph(breadcrumb)} />}
      <main className={`w-full min-w-0 ${className}`}>{children}</main>
      <Footer />
    </>
  );
};
