import Link from "next/link";

import { Reveal } from "@/components/ui/reveal";

const COLUMNS = [
  {
    title: "Explore",
    links: [
      { href: "/flavors", label: "Flavors" },
      { href: "/ingredients", label: "Ingredients" },
      { href: "/taste", label: "Taste" },
      { href: "/eco", label: "Eco" },
    ],
  },
  {
    title: "Get Fizzo",
    links: [
      { href: "/shop", label: "Shop" },
      { href: "/reviews", label: "Reviews" },
      { href: "/contact", label: "Contact" },
    ],
  },
  {
    title: "Legal",
    links: [{ href: "/privacy-policy", label: "Privacy policy" }],
  },
] as const;

export const Footer = () => (
  <footer className="relative mt-[8rem] w-full overflow-hidden border-t border-surface-border bg-background-deep/60 px-[2.4rem] pt-[5rem] max-sm:mt-[5rem] max-sm:px-[1.4rem] max-sm:pt-[3rem]">
    <div className="mx-auto grid max-w-[115rem] gap-[3rem] sm:grid-cols-[1.4fr_1fr_1fr_1fr]">
      <div>
        <p className="font-display uppercase tracking-tight text-[2.6rem] leading-display">Stay fizzy.</p>
        <p className="mt-[0.8rem] max-w-[20rem] text-muted">
          Zero sugar, full bubbles. Five flavors, one very cold can.
        </p>
      </div>
      {COLUMNS.map((column) => (
        <nav key={column.title} aria-label={column.title}>
          <h2 className="text-[0.85rem] uppercase tracking-widest text-muted">{column.title}</h2>
          <ul className="mt-[1rem] space-y-[0.6rem]">
            {column.links.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="transition-colors duration-[var(--duration-fast)] ease-entrance hover:text-accent"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      ))}
    </div>
    <Reveal y={80} className="mx-auto mt-[3rem] max-w-[115rem]">
      <p
        aria-hidden
        className="select-none text-center font-display uppercase tracking-tight text-[19rem] leading-[0.8] text-foreground/10 max-sm:text-[7rem]"
      >
        Fizzo
      </p>
    </Reveal>
    <p className="mx-auto max-w-[115rem] pb-[1.6rem] pt-[1rem] text-[0.8rem] text-muted">
      Fizzo is a fictional brand — a design and animation demo. © Fizzo Beverage Co.
    </p>
  </footer>
);
