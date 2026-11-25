import { pageMetadata } from "@/lib/page-metadata";
import { FlavorShowcase } from "@/components/sections/flavor-showcase";
import { PageHero } from "@/components/sections/page-hero";
import { PageShell } from "@/components/site/page-shell";

export const flavorsMetadata = pageMetadata("/flavors");

export const FlavorsView = () => (
  <PageShell path="/flavors">
    <PageHero eyebrow="The line-up" title="Five flavors.">
      Tap a flavor and watch the can, the berries and the whole page change colour.
      Every one is zero sugar and zero compromise.
    </PageHero>
    <FlavorShowcase />
  </PageShell>
);
