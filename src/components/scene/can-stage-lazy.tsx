"use client";

import dynamic from "next/dynamic";
import type { ComponentProps } from "react";

import { useRobot } from "@/components/common/robot-view";

const CanStage = dynamic(() => import("./can-stage").then((m) => m.CanStage), {
  ssr: false,
});

/**
 * Loads three.js only when a person is looking: the robot form (crawlers, lab
 * tools) gets an empty box — a still, no WebGL download.
 */
export const LazyCanStage = (props: ComponentProps<typeof CanStage>) => {
  const robot = useRobot();
  if (robot) return <div className={props.className} role="img" aria-label={props.label} />;
  return <CanStage {...props} />;
};
