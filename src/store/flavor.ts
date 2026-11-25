import { create } from "zustand";

import type { FlavorId } from "@/data/flavors";

interface FlavorState {
  flavor: FlavorId;
  setFlavor: (flavor: FlavorId) => void;
}

/** The flavor the whole site is dressed in — can, glow and page colour. */
export const useFlavor = create<FlavorState>((set) => ({
  flavor: "blueberry",
  setFlavor: (flavor) => set({ flavor }),
}));
