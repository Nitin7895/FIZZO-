"use client";

import { Spring } from "@/components/common/robot-spring";

/** Page transition: each route fades in (opacity only — a transform here would trap the fixed 3D stage) as it mounts. */
export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <Spring
      tag="div"
      mode="once"
      from={{ opacity: 0 }}
      to={{ opacity: 1 }}
      config={{ tension: 170, friction: 26 }}
      className="flex w-full min-w-0 max-w-full flex-col items-center overflow-x-clip"
    >
      {children}
    </Spring>
  );
}
