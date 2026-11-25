"use client";

import { Spring } from "@/components/common/robot-spring";
import { LazyCanStage } from "@/components/scene/can-stage-lazy";
import { Button } from "@/components/ui/button";
import { FLAVORS, flavorById } from "@/data/flavors";
import { useCart } from "@/store/cart";
import { useFlavor } from "@/store/flavor";

/** The Flavors page: a big live can on one side, the line-up on the other. */
export const FlavorShowcase = () => {
  const flavorId = useFlavor((state) => state.flavor);
  const setFlavor = useFlavor((state) => state.setFlavor);
  const add = useCart((state) => state.add);
  const flavor = flavorById(flavorId);

  return (
    <section className="mx-auto grid max-w-[115rem] items-center gap-[1rem] px-[2.4rem] max-sm:px-[1.4rem] lg:grid-cols-[1.1fr_1fr]">
      <div className="relative h-[42rem] min-w-0 max-sm:h-[26rem]">
        <LazyCanStage
          label={`${flavor.name} Fizzo can`}
          className="absolute inset-0"
          fruit={8}
          trackWindow={false}
        />
      </div>

      <div className="min-w-0">
        <ul className="space-y-[0.7rem]">
          {FLAVORS.map((item) => {
            const active = item.id === flavorId;
            return (
              <li key={item.id}>
                <button
                  type="button"
                  onClick={() => setFlavor(item.id)}
                  aria-pressed={active}
                  className={`flex w-full cursor-pointer items-center gap-[1.2rem] rounded-card border px-[1.4rem] py-[1rem] text-left transition-colors duration-[var(--duration-fast)] ease-entrance ${active ? "border-accent bg-surface-border" : "border-surface-border bg-surface hover:bg-surface-border"}`}
                >
                  <span
                    aria-hidden
                    className="h-[3.2rem] w-[1.8rem] shrink-0 rounded-[0.5rem]"
                    style={{
                      background: `linear-gradient(160deg, ${item.scene.can}, ${item.scene.canDeep})`,
                    }}
                  />
                  <span className="flex-1">
                    <span className="block font-display uppercase tracking-tight text-[1.9rem] leading-display">{item.name}</span>
                    <span className="block text-[0.9rem] text-muted">{item.tagline}</span>
                  </span>
                  <span className="font-semibold">${item.price.toFixed(2)}</span>
                </button>
              </li>
            );
          })}
        </ul>

        <Spring
          key={flavorId}
          tag="div"
          mode="once"
          from={{ opacity: 0, y: 20 }}
          to={{ opacity: 1, y: 0 }}
          className="mt-[1.6rem] rounded-card border border-surface-border bg-surface p-[1.6rem]"
        >
          <p className="text-[0.8rem] uppercase tracking-[0.2em] text-muted">Tasting notes</p>
          <ul className="mt-[0.7rem] flex flex-wrap gap-[0.5rem]">
            {flavor.notes.map((note) => (
              <li key={note} className="rounded-full bg-accent px-[0.9rem] py-[0.3rem] text-[0.9rem] text-accent-ink">
                {note}
              </li>
            ))}
          </ul>
          <div className="mt-[1.2rem] flex items-center justify-between">
            <p className="text-muted">
              {flavor.calories} calories · 0 g sugar · 350 ml
            </p>
            <Button onClick={() => add(flavor.id)}>Add to cart</Button>
          </div>
        </Spring>
      </div>
    </section>
  );
};
