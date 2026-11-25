"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

import { Spring } from "@/components/common/robot-spring";
import { flavorById } from "@/data/flavors";
import { useMounted } from "@/hooks/use-mounted";
import { useScrollLock } from "@/hooks/use-scroll-lock";
import { useCart } from "@/store/cart";

const formatPrice = (value: number) => `$${value.toFixed(2)}`;

/** Slide-in cart. A demo: checkout is not connected to a payment provider. */
export const CartDrawer = () => {
  const { lines, open, setOpen, change } = useCart();
  const mounted = useMounted();
  const [note, setNote] = useState(false);
  useScrollLock(open);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, setOpen]);

  if (!mounted) return null;

  const total = lines.reduce(
    (sum, line) => sum + flavorById(line.flavor).price * line.quantity,
    0,
  );

  return createPortal(
    <div
      className={`fixed inset-x-0 top-0 z-[70] h-dvh ${open ? "" : "pointer-events-none"}`}
      inert={!open}
    >
      <Spring
        tag="div"
        mode="always"
        enabled={open}
        from={{ opacity: 0 }}
        to={{ opacity: 1 }}
        className="absolute inset-0 bg-background-deep/70"
        onClick={() => setOpen(false)}
      />
      <Spring
        tag="aside"
        mode="always"
        enabled={open}
        from={{ x: "105%" }}
        to={{ x: "0%" }}
        config={{ tension: 190, friction: 26 }}
        className="absolute right-0 top-0 flex h-dvh w-[26rem] max-w-full flex-col border-l border-surface-border bg-menu-surface pb-[env(safe-area-inset-bottom)] text-menu-foreground max-sm:w-full"
        aria-label="Shopping cart"
      >
        <div className="flex items-center justify-between p-[1.6rem]">
          <h2 className="font-display uppercase tracking-tight text-[2rem]">Your cart</h2>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="grid size-[2.4rem] cursor-pointer place-items-center rounded-full border border-surface-border text-[1.1rem]"
            aria-label="Close cart"
          >
            ✕
          </button>
        </div>
        <ul className="flex-1 space-y-[0.8rem] overflow-y-auto overscroll-contain px-[1.6rem]">
          {lines.length === 0 && (
            <li className="pt-[2rem] text-muted">Nothing here yet. Pick a flavor!</li>
          )}
          {lines.map((line) => {
            const flavor = flavorById(line.flavor);
            return (
              <li
                key={line.flavor}
                className="flex items-center gap-[1rem] rounded-card border border-surface-border bg-surface p-[1rem]"
              >
                <span
                  aria-hidden
                  className="h-[3.4rem] w-[1.9rem] shrink-0 rounded-[0.5rem]"
                  style={{
                    background: `linear-gradient(160deg, ${flavor.scene.can}, ${flavor.scene.canDeep})`,
                  }}
                />
                <div className="flex-1">
                  <p className="font-medium">{flavor.name}</p>
                  <p className="text-[0.9rem] text-muted">{formatPrice(flavor.price)} each</p>
                </div>
                <div className="flex items-center gap-[0.5rem]">
                  <button
                    type="button"
                    className="grid size-[1.8rem] cursor-pointer place-items-center rounded-full border border-surface-border"
                    onClick={() => change(line.flavor, -1)}
                    aria-label={`Remove one ${flavor.name}`}
                  >
                    −
                  </button>
                  <span className="w-[1.2rem] text-center">{line.quantity}</span>
                  <button
                    type="button"
                    className="grid size-[1.8rem] cursor-pointer place-items-center rounded-full border border-surface-border"
                    onClick={() => change(line.flavor, 1)}
                    aria-label={`Add one ${flavor.name}`}
                  >
                    +
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
        <div className="space-y-[1rem] border-t border-surface-border p-[1.6rem]">
          <p className="flex justify-between text-[1.2rem]">
            <span>Total</span>
            <span className="font-semibold">{formatPrice(total)}</span>
          </p>
          <button
            type="button"
            disabled={lines.length === 0}
            onClick={() => setNote(true)}
            className="w-full cursor-pointer rounded-full bg-accent py-[1rem] text-[1.1rem] font-medium text-accent-ink transition-colors duration-[var(--duration-fast)] ease-entrance hover:bg-foreground disabled:opacity-40"
          >
            Checkout
          </button>
          {note && (
            <p className="text-[0.9rem] text-muted" role="status">
              This is a design demo — Fizzo is a fictional brand, so there is nothing to buy.
            </p>
          )}
        </div>
      </Spring>
    </div>,
    document.body,
  );
};
