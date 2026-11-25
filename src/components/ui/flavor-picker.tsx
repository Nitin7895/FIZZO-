"use client";

import { FLAVORS } from "@/data/flavors";
import { useFlavor } from "@/store/flavor";

interface FlavorPickerProps {
  className?: string;
  /** `cards` shows the name and price (home hero); `dots` is a compact row. */
  variant?: "cards" | "dots";
}

/** Picks the site's flavor — the can, the glow and the page colour all follow. */
export const FlavorPicker = ({ className = "", variant = "cards" }: FlavorPickerProps) => {
  const flavor = useFlavor((state) => state.flavor);
  const setFlavor = useFlavor((state) => state.setFlavor);

  return (
    <div
      role="radiogroup"
      aria-label="Choose a flavor"
      className={`flex ${variant === "cards" ? "gap-[0.8rem]" : "gap-[0.6rem]"} ${className}`}
    >
      {FLAVORS.map((item) => {
        const active = item.id === flavor;
        return (
          <button
            key={item.id}
            type="button"
            role="radio"
            aria-checked={active}
            aria-label={item.name}
            onClick={() => setFlavor(item.id)}
            className={`group relative cursor-pointer overflow-hidden border text-left transition-colors duration-[var(--duration-fast)] ease-entrance ${
              variant === "cards"
                ? "flex w-[6.4rem] flex-col items-center rounded-card px-[0.6rem] pb-[0.7rem] pt-[0.9rem] max-sm:w-[5rem]"
                : "size-[2.4rem] rounded-full"
            } ${active ? "border-accent bg-surface-border" : "border-surface-border bg-surface hover:bg-surface-border"}`}
          >
            {variant === "cards" ? (
              <>
                <span
                  aria-hidden
                  className="h-[4rem] w-[2.2rem] rounded-[0.55rem] shadow-lg max-sm:h-[3rem] max-sm:w-[1.7rem]"
                  style={{
                    background: `linear-gradient(160deg, ${item.scene.can}, ${item.scene.canDeep})`,
                  }}
                />
                <span className="mt-[0.5rem] text-[0.62rem] leading-tight text-muted">
                  {item.short}
                </span>
                <span className="text-[0.7rem] font-semibold">${item.price.toFixed(2)}</span>
              </>
            ) : (
              <span
                aria-hidden
                className="absolute inset-[0.25rem] rounded-full"
                style={{ background: item.scene.can }}
              />
            )}
          </button>
        );
      })}
    </div>
  );
};
