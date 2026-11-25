import { pageMetadata } from "@/lib/page-metadata";
import { ContactForm } from "@/components/sections/contact-form";
import { PageHero } from "@/components/sections/page-hero";
import { PageShell } from "@/components/site/page-shell";
import { Reveal } from "@/components/ui/reveal";

export const contactMetadata = pageMetadata("/contact");

export const ContactView = () => (
  <PageShell path="/contact">
    <PageHero eyebrow="Say hello" title="Talk to us.">
      Questions, wholesale, or just a strong opinion about lime. We read everything.
    </PageHero>
    <section className="mx-auto grid max-w-[115rem] gap-[2rem] px-[2.4rem] max-sm:px-[1.4rem] lg:grid-cols-[1.2fr_1fr]">
      <Reveal>
        <ContactForm />
      </Reveal>
      <Reveal delay={150}>
        <div className="rounded-card border border-surface-border bg-surface p-[2rem]">
          <h2 className="font-display uppercase tracking-tight text-[2.4rem] leading-display">Fizzo Beverage Co.</h2>
          <p className="mt-[0.6rem] text-muted">A fictional company, for a very real design demo.</p>
          <p className="mt-[1.4rem]">hello@fizzo.example</p>
          <p className="text-muted">Mon–Fri, 9–5 (cold) time</p>
        </div>
      </Reveal>
    </section>
  </PageShell>
);
