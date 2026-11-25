/**
 * The ground behind every page: one wide glow in the flavor's colour and a fine
 * film grain on top (so flat colour never reads as a digital gradient). Colours
 * are Tier 2 tokens, so it crossfades when a flavor is picked.
 */
export const Backdrop = () => (
  <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
    <div className="absolute left-1/2 top-[-30%] size-[110rem] -translate-x-1/2 rounded-full bg-glow opacity-30 blur-[14rem] transition-colors duration-[var(--duration-slow)] ease-entrance max-sm:size-[40rem]" />
    <div className="absolute inset-0 bg-grain opacity-[0.07] mix-blend-overlay" />
  </div>
);
