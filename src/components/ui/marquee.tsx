"use client";

import { animated, useSpring } from "@react-spring/web";
import type { ReactNode } from "react";

import { useMotionOff } from "@/hooks/use-motion-off";

interface MarqueeProps {
  children: ReactNode;
  /** Seconds for one full lap. */
  seconds?: number;
  reverse?: boolean;
  className?: string;
}

/**
 * An endless ticker — one spring looping a track that holds the content twice.
 * The loop reads `useMotionOff()`: a looping spring under `skipAnimation`
 * would hang the page (motion rule).
 */
export const Marquee = ({
  children,
  seconds = 30,
  reverse = false,
  className = "",
}: MarqueeProps) => {
  const motionOff = useMotionOff();
  const { x } = useSpring({
    from: { x: reverse ? -50 : 0 },
    to: { x: reverse ? 0 : -50 },
    loop: !motionOff,
    config: { duration: seconds * 1000, easing: (t: number) => t },
  });
  return (
    <div className={`overflow-hidden ${className}`}>
      <animated.div
        className="flex w-max will-change-transform"
        style={{ transform: x.to((value) => `translate3d(${value}%,0,0)`) }}
      >
        <div className="flex shrink-0 items-center">{children}</div>
        <div className="flex shrink-0 items-center" aria-hidden>
          {children}
        </div>
      </animated.div>
    </div>
  );
};
