import { create } from "zustand";

import type { FlavorId } from "@/data/flavors";

export interface CartLine {
  flavor: FlavorId;
  quantity: number;
}

interface CartState {
  lines: CartLine[];
  open: boolean;
  add: (flavor: FlavorId) => void;
  change: (flavor: FlavorId, delta: number) => void;
  setOpen: (open: boolean) => void;
}

export const useCart = create<CartState>((set) => ({
  lines: [],
  open: false,
  add: (flavor) =>
    set((state) => {
      const found = state.lines.find((line) => line.flavor === flavor);
      const lines = found
        ? state.lines.map((line) =>
            line.flavor === flavor ? { ...line, quantity: line.quantity + 1 } : line,
          )
        : [...state.lines, { flavor, quantity: 1 }];
      return { lines, open: true };
    }),
  change: (flavor, delta) =>
    set((state) => ({
      lines: state.lines
        .map((line) =>
          line.flavor === flavor ? { ...line, quantity: line.quantity + delta } : line,
        )
        .filter((line) => line.quantity > 0),
    })),
  setOpen: (open) => set({ open }),
}));
