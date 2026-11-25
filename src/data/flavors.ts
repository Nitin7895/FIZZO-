/**
 * The Fizzo flavor line-up — plain content data. The page theme for each
 * flavor lives in `app/globals.css` (`html[data-flavor="…"]`); `scene` colours
 * are the 3D can's own (WebGL cannot read CSS tokens).
 */

export type FlavorId = "blueberry" | "lime" | "cherry" | "mango" | "grape";

export interface Flavor {
  id: FlavorId;
  name: string;
  short: string;
  tagline: string;
  notes: readonly string[];
  price: number;
  calories: number;
  scene: {
    can: string;
    canDeep: string;
    stripe: string;
    berry: string;
    berryDeep: string;
  };
}

export const FLAVORS: readonly Flavor[] = [
  {
    id: "blueberry",
    name: "Blue Burst",
    short: "Blueberry",
    tagline: "Deep, cold and a little bit wild.",
    notes: ["Wild blueberry", "Sparkling water", "Cold-pressed lime"],
    price: 2.9,
    calories: 0,
    scene: { can: "#1f4fd8", canDeep: "#0b1f6b", stripe: "#9fc2ff", berry: "#3a4fb8", berryDeep: "#1a2570" },
  },
  {
    id: "lime",
    name: "Lime Rush",
    short: "Lime",
    tagline: "A zesty snap that wakes everything up.",
    notes: ["Fresh lime zest", "Mint", "Crushed ice"],
    price: 2.9,
    calories: 0,
    scene: { can: "#17a34a", canDeep: "#075a2a", stripe: "#c8ffd9", berry: "#7bd445", berryDeep: "#2f8a1f" },
  },
  {
    id: "cherry",
    name: "Cherry Pop",
    short: "Cherry",
    tagline: "Sweet without the sugar. Bold without the bite.",
    notes: ["Black cherry", "Vanilla bean", "Soft bubbles"],
    price: 3.1,
    calories: 0,
    scene: { can: "#d41f3f", canDeep: "#6e0a1f", stripe: "#ffc2cd", berry: "#c4122f", berryDeep: "#6e0a1f" },
  },
  {
    id: "mango",
    name: "Mango Sun",
    short: "Mango",
    tagline: "Golden hour in a can.",
    notes: ["Alphonso mango", "Passionfruit", "Sea salt"],
    price: 3.1,
    calories: 0,
    scene: { can: "#f08a12", canDeep: "#8a3d02", stripe: "#ffe2a8", berry: "#ffb21f", berryDeep: "#d1620a" },
  },
  {
    id: "grape",
    name: "Grape Night",
    short: "Grape",
    tagline: "Midnight purple, daylight fizz.",
    notes: ["Concord grape", "Blackcurrant", "Elderflower"],
    price: 3.1,
    calories: 0,
    scene: { can: "#7a2fd0", canDeep: "#32096b", stripe: "#e0c2ff", berry: "#6a2bb8", berryDeep: "#2c0a62" },
  },
] as const;

export const flavorById = (id: FlavorId): Flavor =>
  FLAVORS.find((flavor) => flavor.id === id) ?? FLAVORS[0];
