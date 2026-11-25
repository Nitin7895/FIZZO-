"use client";

import { SpringTrigger } from "@/components/animation/springs/spring-trigger";
import { RobotText as TextEngine } from "@/components/common/robot-text";
import { Spring } from "@/components/common/robot-spring";
import { Button } from "@/components/ui/button";
import { FlavorPicker } from "@/components/ui/flavor-picker";

const line = { y: "0%", opacity: 1 } as const;
const lineOut = { y: "110%", opacity: 0 } as const;

/**
 * Hero copy only — the can lives in the page-wide `HomeStage`. The headlines
 * ride out of frame as you scroll (scrubbed springs), clearing the way for it.
 */
export const HomeHero = () => (
  <section id="chapter-hero" className="relative h-[170vh] w-full">
    <div className="sticky top-0 z-10 h-lvh w-full overflow-hidden">
      <div className="pointer-events-none relative z-10 mx-auto flex h-full max-w-[115rem] flex-col justify-between px-[2.4rem] pb-[2.4rem] pt-[7rem] max-sm:px-[1.4rem] max-sm:pb-[1.6rem] max-sm:pt-[5.5rem]">
        <SpringTrigger
          tag="div"
          mode="scrub"
          start="top top"
          end="bottom top"
          from={{ y: 0, x: 0, opacity: 1 }}
          to={{ y: -160, x: -120, opacity: 0 }}
          className="max-w-[34rem] max-sm:max-w-[16rem]"
        >
          <p className="mb-[1rem] text-[0.85rem] font-semibold uppercase tracking-[0.3em] text-accent max-sm:text-[0.65rem]">
            Zero sugar sparkling soda
          </p>
          <TextEngine
            tag="h1"
            mode="once"
            overflow
            className="w-[2.75em] justify-start text-left font-display text-[11rem] uppercase leading-[1.05] tracking-tight max-lg:text-[7rem] max-sm:text-[5.4rem]"
            lineIn={line}
            lineOut={lineOut}
            lineStagger={140}
            lineConfig={{ tension: 120, friction: 20 }}
          >
            Pure fizz
          </TextEngine>
          <Spring
            tag="p"
            mode="once"
            from={{ opacity: 0, y: 24 }}
            to={{ opacity: 1, y: 0 }}
            delayIn={500}
            className="mt-[1.4rem] max-w-[22rem] text-[1.05rem] leading-relaxed text-muted max-sm:hidden"
          >
            Real fruit, tiny bubbles, no sugar. Crack one open and taste the
            coldest soda you have had.
          </Spring>
          <Spring
            tag="div"
            mode="once"
            from={{ opacity: 0, y: 24 }}
            to={{ opacity: 1, y: 0 }}
            delayIn={650}
            className="pointer-events-auto mt-[1.8rem] max-sm:mt-[1rem]"
          >
            <Button href="/shop">Shop now</Button>
          </Spring>
        </SpringTrigger>

        <SpringTrigger
          tag="div"
          mode="scrub"
          start="top top"
          end="bottom top"
          from={{ y: 0, x: 0, opacity: 1 }}
          to={{ y: -120, x: 140, opacity: 0 }}
          className="flex items-end justify-between"
        >
          <Spring
            tag="div"
            mode="once"
            from={{ opacity: 0 }}
            to={{ opacity: 1 }}
            delayIn={900}
            className="pointer-events-auto max-sm:hidden"
          >
            <FlavorPicker />
          </Spring>
          <TextEngine
            tag="p"
            mode="once"
            overflow
            className="w-[5.8em] justify-end text-right font-display text-[5.6rem] uppercase leading-[1.05] tracking-tight max-lg:text-[3.4rem] max-sm:ml-auto max-sm:text-[3.4rem]"
            lineIn={line}
            lineOut={lineOut}
            lineStagger={140}
            lineConfig={{ tension: 120, friction: 20 }}
            delayIn={400}
          >
            Ridiculously cold
          </TextEngine>
        </SpringTrigger>

        <div className="pointer-events-auto mt-[1rem] sm:hidden">
          <FlavorPicker className="justify-between" />
        </div>
      </div>
    </div>
  </section>
);
