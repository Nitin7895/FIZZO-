"use client";

import { SpringTrigger } from "@/components/animation/springs/spring-trigger";

/** A glowing planet that swells and drifts as you scroll past it. */
export const EcoPlanet = () => (
  <div className="relative mx-auto h-[26rem] w-full max-w-[115rem] overflow-hidden max-sm:h-[14rem]">
    <SpringTrigger
      tag="div"
      mode="scrub"
      start="top bottom"
      end="bottom top"
      from={{ scale: 0.55, y: 120, rotate: -12 }}
      to={{ scale: 1.15, y: -60, rotate: 12 }}
      className="absolute left-1/2 top-1/2 size-[24rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-br from-accent via-glow to-background-deep shadow-[0_0_8rem_var(--glow)] max-sm:size-[12rem]"
    >
      <span className="sr-only">A glowing planet</span>
    </SpringTrigger>
  </div>
);
