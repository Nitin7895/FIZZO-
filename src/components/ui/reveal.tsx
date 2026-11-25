"use client";

import type { ReactNode } from "react";

import { Inview } from "@/components/common/robot-inview";
import type { Tags } from "@/types/springs";

interface RevealProps {
  children: ReactNode;
  className?: string;
  tag?: Tags;
  delay?: number;
  y?: number;
  scale?: number;
}

/** Fade + rise into view, once. */
export const Reveal = ({
  children,
  className,
  tag = "div",
  delay = 0,
  y = 48,
  scale = 1,
}: RevealProps) => (
  <Inview
    tag={tag}
    mode="once"
    from={{ opacity: 0, y, scale }}
    to={{ opacity: 1, y: 0, scale: 1 }}
    delayIn={delay}
    config={{ tension: 120, friction: 20 }}
    className={className}
  >
    {children}
  </Inview>
);
