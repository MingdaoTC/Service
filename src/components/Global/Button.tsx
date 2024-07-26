// Third-Party Library
import React from "react";
import Link from "next/link";

type TProps = {
  children: Readonly<React.ReactNode>;
  styleType: "primary" | "secondary" | "danger";
  href?: string;
  onClick?: () => void;
  customStyle?: string;
};

export default function Button({
  children,
  styleType,
  href,
  onClick,
  customStyle,
}: TProps) {
  const styles = {
    default: "px-4 py-2 rounded-md hover:rounded-sm transition-all",
    primary: "bg-mingdao-blue text-white",
    secondary: "bg-transparent text-mingdao-blue border border-mingdao-blue",
    danger: "bg-red-500 text-white",
  };
  return (
    <>
      {href ? (
        <Link
          href={href}
          className={`${styles[styleType]} ${styles.default} ${customStyle}`}
        >
          {children}
        </Link>
      ) : (
        <button
          className={`${styles[styleType]} ${styles.default} ${customStyle}`}
          onClick={onClick}
        >
          {children}
        </button>
      )}
    </>
  );
}
