import { create } from "zustand";

interface StoryState {
  /** Which "inside the can" callout is showing (0–2). */
  insideStep: number;
  setInsideStep: (step: number) => void;
}

export const useStory = create<StoryState>((set) => ({
  insideStep: 0,
  setInsideStep: (insideStep) => set({ insideStep }),
}));
