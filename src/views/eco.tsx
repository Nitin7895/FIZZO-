import { pageMetadata } from "@/lib/page-metadata";
import { EcoPlanet } from "@/components/sections/eco-planet";
import { PageHero } from "@/components/sections/page-hero";
import { PageShell } from "@/components/site/page-shell";
import { Counter } from "@/components/ui/counter";
import { Reveal } from "@/components/ui/reveal";

const FACTS = [
  { value: 100, suffix: "%", label: "Recyclable aluminium cans" },
  { value: 82, suffix: "%", label: "Of our energy is renewable" },
  { value: 3400000, suffix: "", label: "Litres of water saved last year" },
] as const;

const PROMISES = [
  { title: "Infinitely recyclable", body: "Aluminium can be recycled over and over without losing quality — our cans return to shelves in about 60 days." },
  { title: "Lighter shipping", body: "Thinner walls and a lighter lid cut the weight of every pallet we move." },
  { title: "Water first", body: "Every litre we draw is matched with a litre returned to the watershed it came from." },
] as const;

export const ecoMetadata = pageMetadata("/eco");

export const EcoView = () => (
  <PageShell path="/eco">
    <PageHero eyebrow="Good for the planet" title="Eco fizz.">
      Zero sugar is only half of it. Here is what we are doing about the other half.
    </PageHero>
    <EcoPlanet />
    <section className="mx-auto max-w-[115rem] px-[2.4rem] max-sm:px-[1.4rem]">
      <dl className="grid gap-[1rem] sm:grid-cols-3">
        {FACTS.map((fact, index) => (
          <Reveal key={fact.label} delay={index * 120}>
            <div className="rounded-card border border-surface-border bg-surface p-[2rem] text-center">
              <dd className="font-display uppercase tracking-tight text-[4.6rem] leading-display text-accent max-sm:text-[3rem]">
                <Counter value={fact.value} suffix={fact.suffix} />
              </dd>
              <dt className="text-muted">{fact.label}</dt>
            </div>
          </Reveal>
        ))}
      </dl>
      <ul className="mt-[1.2rem] grid gap-[1rem] lg:grid-cols-3">
        {PROMISES.map((promise, index) => (
          <li key={promise.title}>
            <Reveal delay={index * 120}>
              <div className="h-full rounded-card border border-surface-border bg-surface p-[1.8rem]">
                <h3 className="font-display uppercase tracking-tight text-[2rem] leading-display">{promise.title}</h3>
                <p className="mt-[0.4rem] text-muted">{promise.body}</p>
              </div>
            </Reveal>
          </li>
        ))}
      </ul>
    </section>
  </PageShell>
);
