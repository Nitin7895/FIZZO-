"use client";

import { animated, useSpring } from "@react-spring/web";
import { useEffect, useState } from "react";

import { useFinePointer } from "@/hooks/use-mounted";
import { useMotionOff } from "@/hooks/use-motion-off";

/**
 * A soft bubble that trails the mouse and swells over links and buttons.
 * Fine pointers only — touch devices and reduced-motion visitors never get it.
 */
export const Cursor = () => {
  const motionOff = useMotionOff();
  const fine = useFinePointer();
  const [hot, setHot] = useState(false);
  const [{ x, y }, api] = useSpring(() => ({
    x: -100,
    y: -100,
    config: { tension: 320, friction: 26 },
  }));
  const { scale } = useSpring({
    scale: hot ? 2.6 : 1,
    config: { tension: 260, friction: 18 },
  });

  useEffect(() => {
    if (!fine || motionOff) return;
    const move = (event: PointerEvent) => {
      api.start({ x: event.clientX, y: event.clientY });
      const target = event.target;
      setHot(
        target instanceof Element &&
          target.closest("a, button, [data-hot]") !== null,
      );
    };
    window.addEventListener("pointermove", move, { passive: true });
    return () => window.removeEventListener("pointermove", move);
  }, [api, fine, motionOff]);

  if (!fine || motionOff) return null;
  return (
    <animated.div
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-[80] size-[1.4rem] rounded-full bg-accent mix-blend-difference"
      style={{
        x,
        y,
        scale,
        translateX: "-50%",
        translateY: "-50%",
      }}
    />
  );
};
