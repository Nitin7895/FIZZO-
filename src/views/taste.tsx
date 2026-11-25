import { pageMetadata } from "@/lib/page-metadata";
import { SpringTrigger } from "@/components/animation/springs/spring-trigger";
import { PageHero } from "@/components/sections/page-hero";
import { TasteMeters } from "@/components/sections/taste-meters";
import { PageShell } from "@/components/site/page-shell";
import { Heading } from "@/components/ui/heading";
import { Marquee } from "@/components/ui/marquee";
import { Reveal } from "@/components/ui/reveal";

const WORDS = [
  { word: "Crisp.", from: -300, to: 300 },
  { word: "Cold.", from: 300, to: -300 },
  { word: "Clean.", from: -300, to: 300 },
] as const;

const STEPS = [
  { title: "The snap", body: "A sharp, bright first sip — fine bubbles that tingle instead of burn." },
  { title: "The fruit", body: "Real juice and fruit oils bloom mid-sip, ripe and just a little wild." },
  { title: "The finish", body: "No syrupy cling. The sweetness fades clean and leaves you wanting another." },
] as const;

export const tasteMetadata = pageMetadata("/taste");

export const TasteView = () => (
  <PageShell path="/taste">
    <PageHero eyebrow="How it tastes" title="Loud. Clean.">
      Three beats in every sip. Pick a flavor below to see its profile.
    </PageHero>

    <section aria-label="Taste words" className="overflow-hidden py-[3rem]">
      {WORDS.map((item) => (
        <SpringTrigger
          key={item.word}
          tag="div"
          mode="scrub"
          start="top bottom"
          end="bottom top"
          from={{ x: item.from }}
          to={{ x: item.to }}
          className="whitespace-nowrap text-center font-display uppercase tracking-tight text-[13rem] leading-[1.05] text-foreground/90 max-sm:text-[6rem]"
        >
          {item.word}
        </SpringTrigger>
      ))}
    </section>

    <section className="mx-auto grid max-w-[115rem] gap-[1.4rem] px-[2.4rem] pt-[3rem] max-sm:px-[1.4rem] lg:grid-cols-[1fr_1.2fr]">
      <div className="space-y-[1rem]">
        <Heading tag="h2" className="font-display uppercase tracking-tight text-[4.4rem] max-sm:text-[2.6rem]">
          Three beats per sip.
        </Heading>
        {STEPS.map((step, index) => (
          <Reveal key={step.title} delay={index * 120}>
            <div className="rounded-card border border-surface-border bg-surface p-[1.4rem]">
              <p className="font-display uppercase tracking-tight text-[1.8rem] text-accent">{step.title}</p>
              <p className="text-muted">{step.body}</p>
            </div>
          </Reveal>
        ))}
      </div>
      <Reveal>
        <TasteMeters />
      </Reveal>
    </section>

    <Marquee seconds={28} reverse className="mt-[6rem] border-y border-surface-border py-[1.2rem]">
      {["Sparkling", "Zero sugar", "Ice cold", "Real fruit", "Tiny bubbles"].map((text) => (
        <span key={text} className="flex items-center font-display uppercase tracking-tight text-[3.4rem] max-sm:text-[2rem]">
          <span className="px-[2rem]">{text}</span>
          <span aria-hidden className="text-accent">
            ✦
          </span>
        </span>
      ))}
    </Marquee>
  </PageShell>
);
