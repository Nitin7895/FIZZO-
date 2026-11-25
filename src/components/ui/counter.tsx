"use client";

import { animated, useSpring } from "@react-spring/web";
import { useEffect, useRef, useState } from "react";

import { useRobot } from "@/components/common/robot-view";

interface CounterProps {
  value: number;
  suffix?: string;
  className?: string;
}

/** A number that springs up from 0 the first time it scrolls into view. */
export const Counter = ({ value, suffix = "", className }: CounterProps) => {
  const ref = useRef<HTMLSpanElement>(null);
  const robot = useRobot();
  const [seen, setSeen] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setSeen(true);
        observer.disconnect();
      }
    });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const { n } = useSpring({
    n: seen || robot ? value : 0,
    config: { tension: 40, friction: 18 },
  });

  return (
    <span ref={ref} className={className}>
      <animated.span>{n.to((v) => Math.round(v).toLocaleString("en-US"))}</animated.span>
      {suffix}
    </span>
  );
};
