"use client";

import { useEffect, useRef } from "react";

import { useMotionOff } from "@/hooks/use-motion-off";
import { createCanScene, type CanPose, type CanSceneHandle } from "@/lib/scene/can-scene";
import { keepSceneAlive } from "@/lib/scene/webgl-context";
import { useFlavor } from "@/store/flavor";

interface CanStageProps {
  className?: string;
  fruit?: number;
  /** Scroll-driven explode amount (0–1). Read every animation frame via the ref. */
  explode?: { current: number };
  /** The can's pose (position, scale, rotation) — a ref a scroll story writes to. */
  pose?: { current: Partial<CanPose> };
  /** Follow the pointer anywhere on the page, not just over the stage. */
  trackWindow?: boolean;
  label: string;
}

/**
 * The live 3D can. Client leaf; lives in a box that the caller sizes
 * (`<SceneViewport>` for a full-screen hero). Rebuilds itself after a lost
 * WebGL context (`keepSceneAlive`).
 */
export const CanStage = ({
  className = "",
  fruit = 12,
  explode,
  pose,
  trackWindow = true,
  label,
}: CanStageProps) => {
  const boxRef = useRef<HTMLDivElement>(null);
  const handleRef = useRef<CanSceneHandle | null>(null);
  const motionOff = useMotionOff();
  const flavor = useFlavor((state) => state.flavor);
  const flavorRef = useRef(flavor);
  const poseRef = useRef(pose);
  useEffect(() => {
    poseRef.current = pose;
  }, [pose]);

  useEffect(() => {
    flavorRef.current = flavor;
    handleRef.current?.setFlavor(flavor);
  }, [flavor]);

  useEffect(() => {
    const box = boxRef.current;
    if (!box) return;
    return keepSceneAlive({
      container: box,
      build: ({ onContextChange }) => {
        const scene = createCanScene({
          container: box,
          flavor: flavorRef.current,
          fruit,
          still: motionOff,
          pose: poseRef.current?.current,
        });
        handleRef.current = scene;
        const lost = (event: Event) => {
          event.preventDefault();
          onContextChange();
        };
        scene.canvas.addEventListener("webglcontextlost", lost);
        scene.canvas.addEventListener("webglcontextrestored", onContextChange);
        return {
          isBroken: scene.isBroken,
          frames: scene.frames,
          dispose: () => {
            scene.canvas.removeEventListener("webglcontextlost", lost);
            scene.canvas.removeEventListener("webglcontextrestored", onContextChange);
            scene.dispose();
            if (handleRef.current === scene) handleRef.current = null;
          },
        };
      },
    });
  }, [fruit, motionOff]);

  useEffect(() => {
    if (motionOff) return;
    const target: Window | HTMLDivElement | null = trackWindow ? window : boxRef.current;
    if (!target) return;
    const onMove = (event: Event) => {
      const e = event as PointerEvent;
      const rect = boxRef.current?.getBoundingClientRect();
      if (!rect || rect.width === 0) return;
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      handleRef.current?.setPointer(
        Math.max(-1.2, Math.min(1.2, x)),
        Math.max(-1.2, Math.min(1.2, y)),
      );
    };
    target.addEventListener("pointermove", onMove);
    return () => target.removeEventListener("pointermove", onMove);
  }, [motionOff, trackWindow]);

  useEffect(() => {
    if (!explode && !pose) return;
    let raf = 0;
    const loop = () => {
      const handle = handleRef.current;
      if (handle) {
        if (pose) handle.setPose(pose.current);
        if (explode) handle.setPose({ explode: explode.current });
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [explode, pose]);

  return <div ref={boxRef} className={className} role="img" aria-label={label} />;
};
