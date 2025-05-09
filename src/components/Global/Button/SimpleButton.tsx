import Link from "next/link";
// Third-Party Library
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
  type = "primary",
  href,
  onClick,
  className,
}: TProps) {
  const styles = {
    default: "text-[#7e7e7e] border-0 hover:text-mingdao-blue",
    primary: "",
    secondary: "",
    danger: "",
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
        >
          {children}
        </button>
      )}
    </>
  );
}
