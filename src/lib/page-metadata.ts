import type { Metadata } from "next";

import { findRoute } from "@/lib/routes";
import { generateMetadata } from "@/utils/seo/generate-page-metadata";

/** Metadata for a registered route — title and description come from the route registry. */
export const pageMetadata = (path: `/${string}`): Metadata => {
  const route = findRoute(path);
  return generateMetadata({
    title: route?.label,
    description: route?.summary,
    url: path,
  });
};
