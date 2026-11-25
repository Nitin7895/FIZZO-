"use client";

import type { ReactNode } from "react";

import { Hover } from "@/components/common/robot-hover";
import type { Tags } from "@/types/springs";

interface HoverCardProps {
  children: ReactNode;
  className?: string;
  tag?: Tags;
  lift?: number;
}

/** A card that rises and leans toward you on hover (springs, desktop only). */
export const HoverCard = ({ children, className, tag = "div", lift = -10 }: HoverCardProps) => (
  <Hover
    tag={tag}
    from={{ y: 0, scale: 1, rotate: 0 }}
    to={{ y: lift, scale: 1.025, rotate: -0.6 }}
    config={{ tension: 260, friction: 18 }}
    className={className}
  >
    {children}
  </Hover>
);
