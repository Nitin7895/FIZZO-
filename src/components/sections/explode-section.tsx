"use client";

import { useEffect, useRef, useState } from "react";

import { Spring } from "@/components/common/robot-spring";
import { LazyCanStage } from "@/components/scene/can-stage-lazy";
import { FlavorPicker } from "@/components/ui/flavor-picker";

const STEPS = [
  {
    title: "Sparkling water",
    body: "Filtered spring water, carbonated near freezing so the bubbles come out tiny and stay put.",
  },
  {
    title: "Real fruit",
    body: "Cold-pressed juice and fruit oils — the flavor of the fruit, with none of the sugar.",
  },
  {
    title: "Natural sweetness",
    body: "Monk fruit and a whisper of stevia. Sweet where you want it, gone before the aftertaste.",
  },
] as const;

const smooth = (value: number) => {
  const x = Math.min(1, Math.max(0, value));
  return x * x * (3 - 2 * x);
};

/**
 * Scroll takes the can apart: the lid lifts, the base drops, the berries
 * spread. Progress is read from the section's own position and written into a
 * ref the 3D scene reads every frame — no React render per scroll tick.
 */
export const ExplodeSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const explode = useRef(0);
  const [step, setStep] = useState(0);

  useEffect(() => {
    let raf = 0;
    const update = () => {
      const node = sectionRef.current;
      if (node) {
        const rect = node.getBoundingClientRect();
        const travel = rect.height - window.innerHeight;
        const progress = travel > 0 ? Math.min(1, Math.max(0, -rect.top / travel)) : 0;
        explode.current = smooth((progress - 0.08) / 0.5);
        const next = progress < 0.36 ? 0 : progress < 0.68 ? 1 : 2;
        setStep((current) => (current === next ? current : next));
      }
      raf = requestAnimationFrame(update);
    };
    raf = requestAnimationFrame(update);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <section ref={sectionRef} className="relative h-[320vh] w-full" aria-label="What is inside a can">
      <div className="sticky top-0 h-lvh w-full overflow-hidden">
        <LazyCanStage
          label="A Fizzo can taken apart into lid, body and base"
          className="absolute inset-0"
          fruit={10}
          explode={explode}
        />
        <div className="pointer-events-none relative z-10 mx-auto flex h-full max-w-[115rem] flex-col justify-end px-[2.4rem] pb-[5rem] max-sm:px-[1.4rem] max-sm:pb-[2rem]">
          <Spring
            key={step}
            tag="div"
            mode="once"
            from={{ opacity: 0, y: 30 }}
            to={{ opacity: 1, y: 0 }}
            config={{ tension: 150, friction: 20 }}
            className="max-w-[24rem] rounded-card border border-surface-border bg-background-deep/60 p-[1.8rem] max-sm:max-w-full"
          >
            <p className="font-display uppercase tracking-tight text-[1.4rem] text-accent">
              0{step + 1} / 0{STEPS.length}
            </p>
            <h3 className="font-display uppercase tracking-tight text-[3rem] leading-display">{STEPS[step].title}</h3>
            <p className="mt-[0.5rem] leading-relaxed text-muted">{STEPS[step].body}</p>
          </Spring>
          <div className="pointer-events-auto mt-[1rem]">
            <FlavorPicker variant="dots" />
          </div>
        </div>
      </div>
    </section>
  );
};
