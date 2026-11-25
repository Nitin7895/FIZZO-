import { pageMetadata } from "@/lib/page-metadata";
import { ExplodeSection } from "@/components/sections/explode-section";
import { PageHero } from "@/components/sections/page-hero";
import { PageShell } from "@/components/site/page-shell";
import { Reveal } from "@/components/ui/reveal";

const LIST = [
  { name: "Carbonated spring water", note: "Filtered, chilled, then carbonated at 1 °C." },
  { name: "Fruit juice from concentrate", note: "Under 2% — enough for real flavor." },
  { name: "Citric acid", note: "The tart that makes your mouth wake up." },
  { name: "Monk fruit extract", note: "Zero-calorie sweetness from a small green gourd." },
  { name: "Stevia leaf extract", note: "A whisper, to round the edges." },
  { name: "Natural flavors", note: "Fruit oils and essences. No artificial colors." },
] as const;

export const ingredientsMetadata = pageMetadata("/ingredients");

export const IngredientsView = () => (
  <PageShell path="/ingredients">
    <PageHero eyebrow="Look inside" title="Taken apart.">
      Scroll to lift the lid on a Fizzo can. Six ingredients, all of which you can pronounce.
    </PageHero>
    <ExplodeSection />
    <section className="mx-auto mt-[4rem] max-w-[115rem] px-[2.4rem] max-sm:px-[1.4rem]">
      <ul className="grid gap-[1rem] sm:grid-cols-2 lg:grid-cols-3">
        {LIST.map((item, index) => (
          <li key={item.name}>
            <Reveal delay={(index % 3) * 100}>
              <div className="h-full rounded-card border border-surface-border bg-surface p-[1.6rem]">
                <h3 className="text-[1.2rem] font-semibold">{item.name}</h3>
                <p className="mt-[0.4rem] text-muted">{item.note}</p>
              </div>
            </Reveal>
          </li>
        ))}
      </ul>
    </section>
  </PageShell>
);
