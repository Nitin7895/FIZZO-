"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { HoverCard } from "@/components/ui/hover-card";
import { flavorById, type FlavorId } from "@/data/flavors";
import { useCart } from "@/store/cart";
import { useFlavor } from "@/store/flavor";

/** One buyable flavor. Hovering previews its colour on the whole page. */
export const ProductCard = ({ id }: { id: FlavorId }) => {
  const flavor = flavorById(id);
  const add = useCart((state) => state.add);
  const setFlavor = useFlavor((state) => state.setFlavor);
  const [added, setAdded] = useState(false);

  return (
    <HoverCard
      lift={-12}
      className="flex h-full flex-col items-center rounded-card border border-surface-border bg-surface p-[1.8rem]"
    >
      <div
        onPointerEnter={() => setFlavor(id)}
        className="flex w-full flex-col items-center"
        data-hot
      >
        <span
          aria-hidden
          className="h-[13rem] w-[7rem] rounded-[1.4rem] shadow-2xl max-sm:h-[8rem] max-sm:w-[4.3rem]"
          style={{
            background: `linear-gradient(160deg, ${flavor.scene.can}, ${flavor.scene.canDeep})`,
          }}
        />
        <h3 className="mt-[1.4rem] font-display uppercase tracking-tight text-[2rem] leading-display">{flavor.name}</h3>
        <p className="text-center text-[0.85rem] text-muted">{flavor.notes.join(" · ")}</p>
      </div>
      <p className="mt-[0.8rem] text-[1.3rem] font-semibold">${flavor.price.toFixed(2)}</p>
      <Button
        className="mt-[1rem] !px-[1.3rem] !py-[0.7rem] !text-[0.95rem]"
        onClick={() => {
          add(id);
          setAdded(true);
        }}
      >
        {added ? "Added ✓" : "Add to cart"}
      </Button>
    </HoverCard>
  );
};
