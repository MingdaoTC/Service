import React from "react";
import Link from "next/link";

type TProps = {
  children: Readonly<React.ReactNode>;
  styleType: "primary" | "secondary" | "danger";
  href?: string;
  onClick?: () => void;
};

export default function Button({ children, styleType, href, onClick }: TProps) {
  const styles = {
    default: "px-4 py-2 rounded-md hover:rounded-sm transition-all",
    primary: "bg-mingdao-blue text-white",
    secondary: "bg-transparent text-mingdao-blue border border-mingdao-blue",
    danger: "bg-red-500 text-white",
  };
  return (
    <>
      {href ? (
        <Link href={href} className={`${styles[styleType]} ${styles.default}`}>
          {children}
        </Link>
      ) : (
        <button
          className={`${styles[styleType]} ${styles.default}`}
          onClick={onClick}
        >
          {children}
        </button>
      )}
    </>
  );
}
