"use client";

import { useEffect, useRef } from "react";

import { SceneViewport } from "@/components/common/scene-viewport";
import { LazyCanStage } from "@/components/scene/can-stage-lazy";
import { FLAVORS } from "@/data/flavors";
import { DEFAULT_POSE, type CanPose } from "@/lib/scene/can-scene";
import { useFlavor } from "@/store/flavor";
import { useStory } from "@/store/story";

/** Where the can stands in each chapter of the home page. */
const POSES: Record<string, CanPose> = {
  "chapter-hero": { ...DEFAULT_POSE, x: 0.02, y: -0.04, scale: 1.05, rotZ: -0.3 },
  "chapter-features": { ...DEFAULT_POSE, x: 0.5, y: 0, scale: 0.95, rotZ: 0.18, rotY: -0.5 },
  "chapter-flavors": { ...DEFAULT_POSE, x: 0, y: 0, scale: 1.2, rotZ: -0.12, rotY: 0 },
  "chapter-inside": { ...DEFAULT_POSE, x: 0, y: 0, scale: 0.95, rotZ: -0.1 },
  "chapter-cta": { ...DEFAULT_POSE, x: -0.46, y: -0.02, scale: 1.05, rotZ: 0.28, rotY: 0.4 },
};
const ORDER = Object.keys(POSES);
const FOCUS = 0.55;

const smooth = (v: number) => {
  const x = Math.min(1, Math.max(0, v));
  return x * x * (3 - 2 * x);
};
const mix = (a: number, b: number, t: number) => a + (b - a) * t;

/**
 * The home page's one persistent 3D can. It sits fixed behind the content and
 * travels between chapters as you scroll: pose targets are blended from the
 * chapters' positions, and two chapters drive state — the pinned "flavors"
 * chapter cycles the flavor (and so the whole page colour), the "inside"
 * chapter pulls the can apart. Writes to refs every frame; React only
 * re-renders when a flavor or a callout actually changes.
 */
export const HomeStage = () => {
  const poseBox = useRef<Partial<CanPose>>({ ...POSES["chapter-hero"] });
  const setFlavor = useFlavor((s) => s.setFlavor);
  const setInsideStep = useStory((s) => s.setInsideStep);

  useEffect(() => {
    const elements = ORDER.map((id) => document.getElementById(id));
    if (elements.some((el) => !el)) return;
    let raf = 0;
    let lastFlavor = -1;
    let lastStep = -1;

    const frame = () => {
      const vh = window.innerHeight;
      const tops = elements.map((el) => (el as HTMLElement).getBoundingClientRect().top);
      const range = vh * 0.8;
      let k = tops.findIndex((top) => top > vh * FOCUS);
      if (k === -1) k = ORDER.length; // past the last chapter
      const from = POSES[ORDER[Math.max(0, k - 1)]];
      const to = k >= ORDER.length || k === 0 ? from : POSES[ORDER[k]];
      const t = k === 0 || k >= ORDER.length ? 0 : smooth(1 - (tops[k] - vh * FOCUS) / range);
      const next = {} as CanPose;
      (Object.keys(from) as (keyof CanPose)[]).forEach((key) => {
        next[key] = mix(from[key], to[key], t);
      });

      // chapter-driven state
      const flavorsEl = elements[ORDER.indexOf("chapter-flavors")] as HTMLElement;
      const fr = flavorsEl.getBoundingClientRect();
      const fp = Math.min(1, Math.max(0, -fr.top / Math.max(1, fr.height - vh)));
      if (fr.top < vh * 0.5 && fr.bottom > vh * 0.5) {
        const idx = Math.min(FLAVORS.length - 1, Math.floor(fp * FLAVORS.length));
        if (idx !== lastFlavor) {
          lastFlavor = idx;
          setFlavor(FLAVORS[idx].id);
        }
        next.rotY = fp * Math.PI * 2 * 1.5;
      }

      const insideEl = elements[ORDER.indexOf("chapter-inside")] as HTMLElement;
      const ir = insideEl.getBoundingClientRect();
      const ip = Math.min(1, Math.max(0, -ir.top / Math.max(1, ir.height - vh)));
      if (ir.top < vh && ir.bottom > 0) {
        next.explode = smooth((ip - 0.1) / 0.5);
        const step = ip < 0.38 ? 0 : ip < 0.7 ? 1 : 2;
        if (step !== lastStep) {
          lastStep = step;
          setInsideStep(step);
        }
      } else {
        next.explode = 0;
      }

      poseBox.current = next;
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, [setFlavor, setInsideStep]);

  return (
    <SceneViewport className="z-[5] pointer-events-none">
      <LazyCanStage
        label="A floating Fizzo soda can with fruit orbiting it"
        className="absolute inset-0"
        fruit={12}
        pose={poseBox}
      />
    </SceneViewport>
  );
};
