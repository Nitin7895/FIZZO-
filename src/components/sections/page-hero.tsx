import type { ReactNode } from "react";

import { Heading } from "@/components/ui/heading";
import { Reveal } from "@/components/ui/reveal";

interface PageHeroProps {
  eyebrow: string;
  title: string;
  children: ReactNode;
}

/** The top of every inner page. */
export const PageHero = ({ eyebrow, title, children }: PageHeroProps) => (
  <section className="mx-auto max-w-[115rem] px-[2.4rem] pb-[2rem] pt-[9rem] max-sm:px-[1.4rem] max-sm:pb-[1.5rem] max-sm:pt-[7.5rem]">
    <Reveal>
      <p className="mb-[1rem] inline-block rounded-full border border-surface-border bg-surface px-[1rem] py-[0.35rem] text-[0.8rem] uppercase tracking-[0.2em] text-muted">
        {eyebrow}
      </p>
    </Reveal>
    <Heading tag="h1" className="font-display uppercase tracking-tight text-[10rem] max-lg:text-[6rem] max-sm:text-[4.8rem]">
      {title}
    </Heading>
    <Reveal delay={200} className="mt-[1.4rem] max-w-[34rem] text-[1.2rem] leading-relaxed text-muted max-sm:text-[1rem]">
      {children}
    </Reveal>
  </section>
);
