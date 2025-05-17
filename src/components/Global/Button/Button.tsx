import Link from "next/link";
// Third-Party Library
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
  className,
  disabled,
}: TProps) {
  const styles = {
    default: "px-4 py-2 rounded-md hover:rounded-sm transition-all disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:rounded-md",
    primary: "bg-mingdao-blue text-white disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:rounded-md",
    secondary: "bg-transparent text-mingdao-blue border border-mingdao-blue disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:rounded-md",
    danger: "bg-red-500 text-white disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:rounded-md",
  };
  return (
    <>
      {href ? (
        <Link
          href={href}
          className={`${styles[type]} ${styles.default} ${className} select-none`}
        >
          {children}
        </Link>
      ) : (
        <button
          className={`${styles[type]} ${styles.default} ${className} select-none`}
          onClick={onClick}
          disabled={disabled}
          type="button"
        >
          {children}
        </button>
      )}
    </>
  );
}
