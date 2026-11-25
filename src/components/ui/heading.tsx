"use client";

import type { ReactNode } from "react";

import { RobotText as TextEngine } from "@/components/common/robot-text";

interface HeadingProps {
  tag?: "h1" | "h2" | "h3" | "p";
  children: ReactNode;
  className?: string;
  align?: "left" | "center";
  stagger?: number;
}

/**
 * A line-by-line clipped reveal for headings. Leading stays ≥ 1.1 because the
 * engine clips to the line box (text-engine rule).
 */
export const Heading = ({
  tag = "h2",
  children,
  className = "",
  align = "left",
  stagger = 90,
}: HeadingProps) => (
  <TextEngine
    tag={tag}
    mode="once"
    overflow
    className={`leading-display ${align === "center" ? "text-center justify-center" : "text-left justify-start"} ${className}`}
    lineIn={{ y: "0%", opacity: 1 }}
    lineOut={{ y: "110%", opacity: 0 }}
    lineStagger={stagger}
    lineConfig={{ tension: 140, friction: 22 }}
  >
    {children}
  </TextEngine>
);
