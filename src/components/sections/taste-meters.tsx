"use client";

import { animated, useSpring } from "@react-spring/web";

import { FlavorPicker } from "@/components/ui/flavor-picker";
import { flavorById, type FlavorId } from "@/data/flavors";
import { useFlavor } from "@/store/flavor";

const PROFILES: Record<FlavorId, readonly number[]> = {
  blueberry: [62, 88, 40, 85],
  lime: [38, 92, 90, 60],
  cherry: [72, 80, 45, 90],
  mango: [80, 70, 35, 95],
  grape: [66, 84, 30, 88],
};
const TRAITS = ["Sweetness", "Fizz", "Zing", "Fruitiness"] as const;

const Bar = ({ label, value }: { label: string; value: number }) => {
  const { w } = useSpring({ w: value, config: { tension: 120, friction: 16 } });
  return (
    <div>
      <div className="flex justify-between text-[0.95rem]">
        <span>{label}</span>
        <animated.span className="text-muted">{w.to((v) => `${Math.round(v)}%`)}</animated.span>
      </div>
      <div className="mt-[0.4rem] h-[0.7rem] overflow-hidden rounded-full bg-surface-border">
        <animated.div
          className="h-full origin-left rounded-full bg-accent"
          style={{ width: "100%", scaleX: w.to((v) => v / 100) }}
        />
      </div>
    </div>
  );
};

/** Pick a flavor, watch its taste profile spring into place. */
export const TasteMeters = () => {
  const flavorId = useFlavor((state) => state.flavor);
  const flavor = flavorById(flavorId);
  const profile = PROFILES[flavorId];

  return (
    <div className="rounded-card border border-surface-border bg-surface p-[2.4rem] max-sm:p-[1.4rem]">
      <div className="flex flex-wrap items-center justify-between gap-[1rem]">
        <h3 className="font-display uppercase tracking-tight text-[2.8rem] leading-display">{flavor.name}</h3>
        <FlavorPicker variant="dots" />
      </div>
      <p className="mt-[0.3rem] text-muted">{flavor.tagline}</p>
      <div className="mt-[1.6rem] space-y-[1.1rem]">
        {TRAITS.map((trait, index) => (
          <Bar key={trait} label={trait} value={profile[index]} />
        ))}
      </div>
    </div>
  );
};
