import { pageMetadata } from "@/lib/page-metadata";
import { PageHero } from "@/components/sections/page-hero";
import { ProductCard } from "@/components/sections/product-card";
import { PageShell } from "@/components/site/page-shell";
import { Reveal } from "@/components/ui/reveal";
import { FLAVORS } from "@/data/flavors";

export const shopMetadata = pageMetadata("/shop");

export const ShopView = () => (
  <PageShell path="/shop">
    <PageHero eyebrow="Get your fizz" title="Shop.">
      Hover a can to preview its colour, then add it to your cart. (This is a design
      demo, so checkout is pretend.)
    </PageHero>
    <section className="mx-auto max-w-[115rem] px-[2.4rem] max-sm:px-[1.4rem]">
      <ul className="grid grid-cols-2 gap-[1rem] sm:grid-cols-3 lg:grid-cols-5">
        {FLAVORS.map((flavor, index) => (
          <li key={flavor.id}>
            <Reveal delay={index * 80} className="h-full">
              <ProductCard id={flavor.id} />
            </Reveal>
          </li>
        ))}
      </ul>
    </section>
  </PageShell>
);
