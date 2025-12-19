"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  buttons: {
    label: string;
    onClick: () => void;
    variant?: "primary" | "secondary" | "danger";
  }[];
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  buttons,
}) => {
  const [mounted, setMounted] = useState(false);
  const [animateIn, setAnimateIn] = useState(false);
  const backdropRef = useRef<HTMLDivElement>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const lastFocusedRef = useRef<HTMLElement | null>(null);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    lastFocusedRef.current = document.activeElement as HTMLElement | null;

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const t = requestAnimationFrame(() => setAnimateIn(true));

    const focusables = getFocusable(dialogRef.current);
    if (focusables.length) {
      focusables[0].focus();
    }

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      } else if (e.key === "Tab") {
        trapFocus(e, dialogRef.current);
      }
    };
    document.addEventListener("keydown", onKey);

    return () => {
      document.body.style.overflow = prevOverflow;
      document.removeEventListener("keydown", onKey);
      cancelAnimationFrame(t);
      setAnimateIn(false);
      lastFocusedRef.current?.focus?.();
    };
  }, [isOpen, onClose]);

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === backdropRef.current) {
      onClose();
    }
  };

  const portalTarget = useMemo(
    () => (mounted ? document.body : null),
    [mounted],
  );

  if (!isOpen || !mounted || !portalTarget) {
    return null;
  }

  const panelBase =
    // 亮色系卡片 + 品牌描邊 + 柔陰影
    "bg-white rounded-2xl ring-1 ring-slate-200 shadow-xl w-full max-w-lg mx-4 overflow-hidden";
  const panelAnim = animateIn
    ? "opacity-100 translate-y-0 scale-100"
    : "opacity-0 translate-y-1 scale-95";
  const backdropAnim = animateIn ? "opacity-100" : "opacity-0";

  return createPortal(
    <div
      ref={backdropRef}
      className={`fixed inset-0 z-[100] flex items-center justify-center transition-opacity duration-200 ease-out bg-slate-900/30 backdrop-blur-sm ${backdropAnim}`}
      onMouseDown={handleBackdropClick}
      aria-hidden={false}
    >
      <dialog
        ref={dialogRef}
        aria-modal="true"
        aria-labelledby="modal-title"
        className={`${panelBase} transition-all duration-200 ease-out ${panelAnim}`}
        onMouseDown={(e) => e.stopPropagation()}
      >
        {/* Brand top bar */}
        <div className="h-1 w-full bg-mingdao-blue" />

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200/80">
          <h3
            id="modal-title"
            className="text-lg md:text-xl font-bold text-slate-800"
          >
            {title}
          </h3>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-500 hover:text-slate-700 hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mingdao-blue/50 transition"
            aria-label="Close"
          >
            <svg
              className="h-6 w-6"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="px-5 py-4 text-slate-700">{children}</div>

        {/* Footer */}
        <div className="flex justify-end gap-2 px-5 pb-5">
          {buttons.map((button, i) => (
            <button
              key={i}
              onClick={button.onClick}
              className={`${btnBase} ${variantClass(button.variant)}`}
            >
              {button.label}
            </button>
          ))}
        </div>
      </dialog>
    </div>,
    portalTarget,
  );
};

export default Modal;

/* ========== Styles ========== */
const btnBase =
  "inline-flex items-center justify-center px-4 py-2 rounded-xl font-semibold transition shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mingdao-blue/50";

function variantClass(variant?: "primary" | "secondary" | "danger") {
  switch (variant) {
    case "primary":
      // 品牌主色：mingdao-blue
      return "text-white bg-mingdao-blue hover:bg-mingdao-blue-dark";
    case "danger":
      return "text-white bg-red-500 hover:bg-red-600";
    default:
      // 次要：白底 + 品牌描邊
      return "bg-white text-mingdao-blue ring-1 ring-mingdao-blue hover:bg-mingdao-blue-light";
  }
}

/* ========== A11y helpers ========== */
function getFocusable(root: HTMLElement | null): HTMLElement[] {
  if (!root) {
    return [];
  }
  const selectors =
    'a[href], area[href], input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, object, embed, [tabindex]:not([tabindex="-1"]), [contenteditable=true]';
  return Array.from(root.querySelectorAll<HTMLElement>(selectors)).filter(
    (el) =>
      el.offsetWidth > 0 ||
      el.offsetHeight > 0 ||
      el === document.activeElement,
  );
}

function trapFocus(e: KeyboardEvent, root: HTMLElement | null) {
  const focusables = getFocusable(root);
  if (focusables.length === 0) {
    return;
  }

  const first = focusables[0];
  const last = focusables[focusables.length - 1];
  const active = document.activeElement as HTMLElement;

  if (!e.shiftKey && active === last) {
    e.preventDefault();
    first.focus();
  } else if (e.shiftKey && active === first) {
    e.preventDefault();
    last.focus();
  }
}
