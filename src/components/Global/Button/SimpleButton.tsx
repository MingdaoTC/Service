import Link from "next/link";
import React from "react";

type TProps = {
  children: Readonly<React.ReactNode>;
  type?: "primary" | "secondary" | "danger";
  href?: string;
  onClick?: () => void;
  className?: string;
};

export default function SimpleButton({
  children,
  type = "secondary",
  href,
  onClick,
  className = "",
}: TProps) {
  const base =
    "inline-flex items-center justify-center gap-1 rounded-lg px-3 py-1.5 text-sm font-medium transition-all select-none";

  const variants: Record<NonNullable<TProps["type"]>, string> = {
    primary:
      "bg-gradient-to-r from-blue-600 to-teal-500 text-white ring-1 ring-slate-200 shadow-sm hover:opacity-90",
    secondary:
      "bg-white text-slate-700 ring-1 ring-slate-200 shadow-sm hover:bg-slate-50",
    danger:
      "bg-red-500 text-white ring-1 ring-red-300 shadow-sm hover:bg-red-600",
  };

  const cls = `${base} ${variants[type]} ${className}`;

  return href ? (
    <Link href={href} className={cls}>
      {children}
    </Link>
  ) : (
    <button className={cls} onClick={onClick}>
      {children}
    </button>
  );
}
