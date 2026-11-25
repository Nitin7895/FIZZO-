"use client";

import { Spring } from "@/components/common/robot-spring";
import { FlavorPicker } from "@/components/ui/flavor-picker";
import { FLAVORS, flavorById } from "@/data/flavors";
import { useFlavor } from "@/store/flavor";
import { useStory } from "@/store/story";

/**
 * Pinned chapter: scroll cycles through the five flavors. The scene (and the
 * whole page colour) follows `useFlavor`, which `HomeStage` drives from scroll;
 * clicking a swatch jumps to it. The giant name sits *behind* the can.
 */
export const FlavorChapter = () => {
  const id = useFlavor((s) => s.flavor);
  const flavor = flavorById(id);
  const index = FLAVORS.findIndex((f) => f.id === id);

  return (
    <section id="chapter-flavors" className="relative h-[520vh] w-full">
      {/* Layer 1 sits behind the can (the stage is z-5), layer 2 in front of it. */}
      <div className="sticky top-0 z-[4] h-lvh w-full overflow-hidden">
        <Spring
          key={`${id}-word`}
          tag="p"
          mode="once"
          from={{ opacity: 0, y: 80, scale: 0.94 }}
          to={{ opacity: 1, y: 0, scale: 1 }}
          config={{ tension: 120, friction: 18 }}
          aria-hidden
          className="absolute inset-x-0 top-1/2 z-0 -translate-y-1/2 select-none text-center font-display text-[22rem] uppercase leading-none tracking-tighter text-accent max-lg:text-[12rem] max-sm:text-[5.4rem]"
        >
          {flavor.short}
        </Spring>
      </div>
      <div className="pointer-events-none sticky top-0 z-10 -mt-[100vh] h-lvh w-full overflow-hidden">
        <div className="relative mx-auto flex h-full max-w-[115rem] items-end justify-between px-[2.4rem] pb-[4rem] max-sm:flex-col max-sm:items-start max-sm:justify-end max-sm:px-[1.4rem] max-sm:pb-[2rem]">
          <Spring
            key={`${id}-info`}
            tag="div"
            mode="once"
            from={{ opacity: 0, x: -40 }}
            to={{ opacity: 1, x: 0 }}
            className="max-w-[19rem]"
          >
            <p className="font-display text-[0.9rem] font-bold uppercase tracking-[0.25em] text-accent">
              0{index + 1} / 0{FLAVORS.length}
            </p>
            <h2 className="mt-[0.4rem] font-display text-[3rem] uppercase leading-display max-sm:text-[1.8rem]">
              {flavor.name}
            </h2>
            <p className="mt-[0.5rem] text-muted max-sm:text-[0.85rem]">{flavor.tagline}</p>
            <p className="mt-[0.8rem] text-[0.9rem] uppercase tracking-widest max-sm:hidden">
              {flavor.notes.join("  /  ")}
            </p>
          </Spring>
          <div className="pointer-events-auto max-sm:mt-[1rem]">
            <FlavorPicker variant="dots" />
            <p className="mt-[0.7rem] text-[0.8rem] uppercase tracking-[0.25em] text-muted">
              Keep scrolling
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

const STEPS = [
  { title: "Sparkling water", body: "Carbonated near freezing, so the bubbles come out tiny and stay put." },
  { title: "Real fruit", body: "Cold-pressed juice and fruit oils. The flavor of the fruit, none of the sugar." },
  { title: "Natural sweetness", body: "Monk fruit and a whisper of stevia. Sweet where you want it, gone before the aftertaste." },
] as const;

/** Pinned chapter: scroll lifts the lid and drops the base while callouts change. */
export const InsideChapter = () => {
  const step = useStory((s) => s.insideStep);
  return (
    <section id="chapter-inside" className="relative h-[360vh] w-full">
      <div className="sticky top-0 z-10 h-lvh w-full overflow-hidden">
        <div className="pointer-events-none relative z-10 mx-auto flex h-full max-w-[115rem] flex-col justify-between px-[2.4rem] py-[7rem] max-sm:px-[1.4rem] max-sm:py-[5.5rem]">
          <p className="font-display text-[0.9rem] font-bold uppercase tracking-[0.3em] text-accent">
            Look inside
          </p>
          <Spring
            key={step}
            tag="div"
            mode="once"
            from={{ opacity: 0, x: step % 2 ? 60 : -60 }}
            to={{ opacity: 1, x: 0 }}
            config={{ tension: 150, friction: 20 }}
            className={`max-w-[22rem] ${step % 2 ? "self-end text-right" : ""}`}
          >
            <p className="font-display text-[7rem] leading-[0.9] text-accent max-sm:text-[4rem]">
              0{step + 1}
            </p>
            <h3 className="font-display text-[3rem] uppercase leading-display max-sm:text-[1.8rem]">
              {STEPS[step].title}
            </h3>
            <p className="mt-[0.5rem] leading-relaxed text-muted">{STEPS[step].body}</p>
          </Spring>
          <span />
        </div>
      </div>
    </section>
  );
};
