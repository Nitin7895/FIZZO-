"use client";

import { useEffect } from "react";

import { useFlavor } from "@/store/flavor";

/** Dresses the whole page in the picked flavor: `<html data-flavor>` drives the Tier 2 tokens. */
export const FlavorTheme = () => {
  const flavor = useFlavor((state) => state.flavor);
  useEffect(() => {
    document.documentElement.dataset.flavor = flavor;
  }, [flavor]);
  return null;
};
