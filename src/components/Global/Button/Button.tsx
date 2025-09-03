import Link from "next/link";
import React from "react";

type TProps = {
  children: Readonly<React.ReactNode>;
  type?: "primary" | "secondary" | "danger";
  href?: string;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
};

export default function Button({
  children,
  type = "primary",
  href,
  onClick,
  className = "",
  disabled,
}: TProps) {
  const base =
    "rounded-md hover:rounded-sm inline-flex items-center justify-center px-4 py-2 font-semibold transition-all " +
    "shadow-sm ring-1 ring-slate-200 disabled:opacity-60 disabled:cursor-not-allowed";

  const variants: Record<NonNullable<TProps["type"]>, string> = {
    primary:
      "bg-gradient-to-r from-blue-600 to-blue-600 text-white focus-visible:outline-none focus-visible:ring-0",
    secondary:
      "bg-white text-slate-800 hover:bg-blue-50/60",
    danger:
      "bg-red-500 text-white hover:bg-red-600",
  };

  const cls = `${base} ${variants[type]} ${className} select-none`;

  if (href) {
    return (
      <Link href={href} className={cls}>
        {children}
      </Link>
    );
  }
  return (
    <button className={cls} onClick={onClick} disabled={disabled} type="button">
      {children}
    </button>
  );
}
