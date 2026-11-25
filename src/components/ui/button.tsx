import Link from "next/link";
import type { ReactNode } from "react";

interface ButtonProps {
  children: ReactNode;
  href?: string;
  onClick?: () => void;
  variant?: "solid" | "ghost";
  className?: string;
  type?: "button" | "submit";
  disabled?: boolean;
}

const base =
  "group inline-flex items-center whitespace-nowrap gap-[0.9rem] rounded-full text-[1.25rem] max-sm:text-[1.1rem] font-medium px-[1.8rem] py-[1rem] max-sm:px-[1.6rem] max-sm:py-[0.95rem] transition-colors duration-[var(--duration-fast)] ease-entrance cursor-pointer disabled:opacity-50";
const variants = {
  solid: "bg-accent text-accent-ink hover:bg-foreground",
  ghost: "border border-surface-border bg-surface text-foreground hover:bg-surface-border",
} as const;

/** The site's pill button — a link when it has an `href`, a button otherwise. */
export const Button = ({
  children,
  href,
  onClick,
  variant = "solid",
  className = "",
  type = "button",
  disabled,
}: ButtonProps) => {
  const cls = `${base} ${variants[variant]} ${className}`;
  if (href) {
    return (
      <Link href={href} className={cls}>
        {children}
      </Link>
    );
  }
  return (
    <button type={type} onClick={onClick} className={cls} disabled={disabled}>
      {children}
    </button>
  );
};
