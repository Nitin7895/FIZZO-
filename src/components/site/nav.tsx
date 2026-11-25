"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

import { Spring } from "@/components/common/robot-spring";
import { useMounted } from "@/hooks/use-mounted";
import { useScrollLock } from "@/hooks/use-scroll-lock";
import { useCart } from "@/store/cart";

const LINKS = [
  { href: "/", label: "Home" },
  { href: "/flavors", label: "Flavors" },
  { href: "/ingredients", label: "Ingredients" },
  { href: "/taste", label: "Taste" },
  { href: "/eco", label: "Eco" },
  { href: "/reviews", label: "Reviews" },
  { href: "/shop", label: "Shop" },
] as const;

const Logo = () => (
  <Link
    href="/"
    className="flex items-center gap-[0.6rem] font-display uppercase tracking-tight text-[2rem] leading-none max-sm:text-[1.9rem]"
    aria-label="Fizzo — home"
  >
    <span
      className="grid size-[2rem] place-items-center rounded-full border-2 border-foreground font-sans text-[1.4rem] leading-none"
      aria-hidden
    >
      +
    </span>
    Fizzo
  </Link>
);

interface MobileMenuProps {
  open: boolean;
  onClose: () => void;
  pathname: string;
}

const MobileMenu = ({ open, onClose, pathname }: MobileMenuProps) => {
  const panelRef = useRef<HTMLDivElement>(null);
  const mounted = useMounted();
  useScrollLock(open);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    panelRef.current?.querySelector<HTMLElement>("a")?.focus();
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!mounted) return null;
  return createPortal(
    <Spring
      tag="div"
      mode="always"
      enabled={open}
      from={{ opacity: 0 }}
      to={{ opacity: 1 }}
      config={{ tension: 180, friction: 24 }}
      className={`fixed inset-x-0 top-0 z-[60] h-dvh overflow-y-auto overscroll-contain bg-menu-surface pb-[env(safe-area-inset-bottom)] text-menu-foreground ${open ? "" : "pointer-events-none"}`}
      inert={!open}
    >
      <div
        ref={panelRef}
        id="mobile-menu"
        className="flex min-h-full flex-col justify-center gap-[0.6rem] px-[2rem] py-[8rem]"
      >
        {LINKS.map((link, index) => (
          <Spring
            key={link.href}
            tag="div"
            mode="always"
            enabled={open}
            from={{ opacity: 0, y: 30 }}
            to={{ opacity: 1, y: 0 }}
            delayIn={80 + index * 50}
            config={{ tension: 160, friction: 20 }}
          >
            <Link
              href={link.href}
              onClick={onClose}
              className={`block font-display uppercase tracking-tight text-[3.6rem] leading-display ${pathname === link.href ? "text-accent" : ""}`}
            >
              {link.label}
            </Link>
          </Spring>
        ))}
        <Link
          href="/contact"
          onClick={onClose}
          className="mt-[1.5rem] inline-flex w-fit rounded-full bg-accent px-[2rem] py-[1rem] text-[1.2rem] text-accent-ink"
        >
          Contact us
        </Link>
      </div>
    </Spring>,
    document.body,
  );
};

export const Nav = () => {
  const pathname = usePathname();
  // The menu is open for one path only: navigating closes it, no effect needed.
  const [openFor, setOpenFor] = useState<string | null>(null);
  const open = openFor === pathname;
  const setOpen = (next: boolean | ((value: boolean) => boolean)) =>
    setOpenFor((current) => {
      const value = typeof next === "function" ? next(current === pathname) : next;
      return value ? pathname : null;
    });
  const toggleRef = useRef<HTMLButtonElement>(null);
  const count = useCart((state) =>
    state.lines.reduce((sum, line) => sum + line.quantity, 0),
  );
  const setCartOpen = useCart((state) => state.setOpen);

  return (
    <header className="fixed inset-x-0 top-0 z-50 flex justify-center px-[2.4rem] max-sm:px-[1.4rem]">
      <div className="mt-[1.6rem] flex w-full max-w-[115rem] items-center justify-between max-sm:mt-[1rem]">
        <Logo />
        <nav
          aria-label="Primary"
          className="hidden items-center gap-[0.2rem] rounded-full border border-surface-border bg-surface p-[0.3rem] sm:flex"
        >
          {LINKS.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={active ? "page" : undefined}
                className={`rounded-full px-[1.1rem] py-[0.55rem] text-[0.95rem] transition-colors duration-[var(--duration-fast)] ease-entrance ${active ? "bg-accent text-accent-ink" : "text-muted hover:text-foreground"}`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
        <div className="flex items-center gap-[0.7rem]">
          <button
            type="button"
            onClick={() => setCartOpen(true)}
            aria-label={`Open cart, ${count} items`}
            className="relative grid size-[2.9rem] cursor-pointer place-items-center rounded-full border border-surface-border bg-surface transition-colors duration-[var(--duration-fast)] ease-entrance hover:bg-surface-border max-sm:size-[2.8rem]"
          >
            <svg
              viewBox="0 0 24 24"
              className="size-[1.2rem]"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              aria-hidden
            >
              <path d="M5 7h14l-1.2 11a2 2 0 0 1-2 1.8H8.2a2 2 0 0 1-2-1.8L5 7Z" />
              <path d="M9 7a3 3 0 0 1 6 0" />
            </svg>
            {count > 0 && (
              <span className="absolute -right-[0.2rem] -top-[0.2rem] grid size-[1.2rem] place-items-center rounded-full bg-accent text-[0.7rem] font-semibold text-accent-ink">
                {count}
              </span>
            )}
          </button>
          <Link
            href="/contact"
            className="hidden rounded-full bg-background-deep px-[1.3rem] py-[0.7rem] text-[0.95rem] transition-colors duration-[var(--duration-fast)] ease-entrance hover:bg-foreground hover:text-accent-ink sm:block"
          >
            Contact Us
          </Link>
          <button
            ref={toggleRef}
            type="button"
            className="relative z-[70] grid size-[2.8rem] cursor-pointer place-items-center rounded-full border border-surface-border bg-surface sm:hidden"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((value) => !value)}
          >
            <span className="relative block h-[0.9rem] w-[1.2rem]">
              <Spring
                tag="span"
                mode="always"
                enabled={open}
                from={{ y: 0, rotate: 0 }}
                to={{ y: 6, rotate: 45 }}
                className="absolute left-0 top-0 block h-[2px] w-full bg-foreground"
              />
              <Spring
                tag="span"
                mode="always"
                enabled={open}
                from={{ opacity: 1 }}
                to={{ opacity: 0 }}
                className="absolute left-0 top-[0.4rem] block h-[2px] w-full bg-foreground"
              />
              <Spring
                tag="span"
                mode="always"
                enabled={open}
                from={{ y: 0, rotate: 0 }}
                to={{ y: -6, rotate: -45 }}
                className="absolute left-0 top-[0.8rem] block h-[2px] w-full bg-foreground"
              />
            </span>
          </button>
        </div>
      </div>
      <MobileMenu
        open={open}
        pathname={pathname}
        onClose={() => {
          setOpen(false);
          toggleRef.current?.focus();
        }}
      />
    </header>
  );
};
