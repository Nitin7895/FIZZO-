import { RobotProvider, RobotView } from "@/components/common/robot-view";
import { FlavorChapter, InsideChapter } from "@/components/sections/home-chapters";
import { HomeHero } from "@/components/sections/home-hero";
import { HomeStage } from "@/components/sections/home-stage";
import { Footer } from "@/components/site/footer";
import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Marquee } from "@/components/ui/marquee";
import { Reveal } from "@/components/ui/reveal";

const STATEMENTS = [
  { k: "0 g", title: "Sugar.", body: "Sweetened with monk fruit and a pinch of stevia. No aftertaste, no crash." },
  { k: "100%", title: "Real fruit.", body: "Cold-pressed juice and fruit oils in every can. You taste it on the first sip." },
  { k: "1 °C", title: "Ridiculously cold.", body: "Carbonated a degree above freezing, for finer bubbles that last to the last drop." },
] as const;

const WORDS = ["Zero sugar", "Real fruit", "Ice cold", "Tiny bubbles"] as const;

/**
 * Home view — a Server Component; the interactive parts are client leaves.
 * One persistent 3D can (`HomeStage`) travels through the chapters as you scroll.
 *
 * `robot` is the robot form (obsidian/frontend/robot-form.md): `app/robot-view`
 * renders `<HomeView robot />` for crawlers and lab tools, routed there by the
 * proxy. Same content — no live 3D (an empty box instead), springs at rest.
 * Never read `headers()` here: `/` must stay static.
 */
export const HomeView = ({ robot = false }: { robot?: boolean }) => {
  return (
    <RobotProvider robot={robot}>
      {robot && <RobotView />}
      <HomeStage />
      <main className="relative w-full min-w-0">
        <HomeHero />

        <Marquee seconds={40} className="relative z-10 border-y border-surface-border py-[1.2rem]">
          {WORDS.map((word) => (
            <span
              key={word}
              className="flex items-center font-display text-[6.5rem] uppercase leading-display tracking-tight max-sm:text-[3rem]"
            >
              <span
                className="px-[2.4rem] text-transparent"
                style={{ WebkitTextStroke: "2px var(--foreground)" }}
              >
                {word}
              </span>
              <span aria-hidden className="size-[1.4rem] rounded-full bg-accent max-sm:size-[0.8rem]" />
            </span>
          ))}
        </Marquee>

        <section id="chapter-features" className="relative z-10 mx-auto max-w-[115rem] px-[2.4rem] max-sm:px-[1.4rem]">
          {STATEMENTS.map((item) => (
            <div key={item.k} className="flex min-h-[95vh] items-center">
              <div className="max-w-[30rem] max-sm:max-w-[13rem]">
                <Reveal y={60}>
                  <p className="font-display text-[0.9rem] font-bold uppercase tracking-[0.3em] text-accent">
                    {item.k}
                  </p>
                </Reveal>
                <Heading
                  tag="h2"
                  className="font-display text-[6.6rem] uppercase tracking-tight max-lg:text-[4.4rem] max-sm:text-[2.2rem]"
                >
                  {item.title}
                </Heading>
                <Reveal delay={200} y={30} className="mt-[1.2rem] max-w-[22rem] leading-relaxed text-muted max-sm:text-[0.85rem]">
                  {item.body}
                </Reveal>
              </div>
            </div>
          ))}
        </section>

        <FlavorChapter />
        <InsideChapter />

        <section
          id="chapter-cta"
          className="relative z-10 mx-auto flex min-h-[110vh] max-w-[115rem] items-center justify-end px-[2.4rem] max-sm:px-[1.4rem]"
        >
          <div className="max-w-[34rem] max-sm:max-w-[14rem]">
            <Heading
              tag="h2"
              className="font-display text-[8rem] uppercase tracking-tight max-lg:text-[5rem] max-sm:text-[2.6rem]"
            >
              Get fizzy.
            </Heading>
            <Reveal delay={250} className="mt-[1.6rem] flex flex-wrap gap-[0.8rem]">
              <Button href="/shop">Shop the cans</Button>
              <Button href="/flavors" variant="ghost">
                All flavors
              </Button>
            </Reveal>
          </div>
        </section>
      </main>
      <div className="relative z-10 w-full">
        <Footer />
      </div>
    </RobotProvider>
  );
};
