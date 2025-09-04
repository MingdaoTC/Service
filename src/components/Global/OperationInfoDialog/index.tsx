"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

const ANIM_MS = 180;

export default function OperationInfoDialog({
  isOpen,
  onClose,
  message,
}: {
  isOpen: boolean;
  onClose: () => void;
  message: string;
}) {
  const dialogRef = useRef<HTMLDialogElement | null>(null);
  const router = useRouter();
  const [animateIn, setAnimateIn] = useState(false);

  // 控制開關與進/退場動畫
  useEffect(() => {
    const el = dialogRef.current;
    if (!el) return;

    if (isOpen) {
      if (!el.open) el.showModal();
      // 等下一幀避免一開始跳動
      requestAnimationFrame(() => setAnimateIn(true));
      // 鎖捲動
      document.body.style.overflow = "hidden";
    } else if (el.open) {
      // 退場動畫後再關閉
      setAnimateIn(false);
      const t = setTimeout(() => {
        try {
          el.close();
        } catch { }
        document.body.style.overflow = "";
      }, ANIM_MS);
      return () => clearTimeout(t);
    }

    return () => {
      // 保險：卸載時還原
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Esc 關閉（<dialog> cancel 事件）
  useEffect(() => {
    const el = dialogRef.current;
    if (!el) return;
    const onCancel = (e: Event) => {
      e.preventDefault(); // 攔截預設行為，走動畫關閉
      onClose();
    };
    el.addEventListener("cancel", onCancel);
    return () => el.removeEventListener("cancel", onCancel);
  }, [onClose]);

  // 點擊遮罩關閉（點在 <dialog> 自身＝Backdrop）
  const handleBackdropClick = (e: React.MouseEvent<HTMLDialogElement>) => {
    if (e.target === dialogRef.current) onClose();
  };

  return (
    <dialog
      ref={dialogRef}
      onMouseDown={handleBackdropClick}
      // 亮色系：半透明遮罩 + 模糊
      className={`
        max-w-2xl p-0 bg-transparent rounded-2xl overflow-visible
        backdrop:bg-black/40 backdrop:backdrop-blur-sm
        transition-[opacity,transform] duration-${ANIM_MS}
        ${animateIn ? "open:opacity-100" : "opacity-0"}
      `}
      aria-labelledby="mdtc-dialog-title"
    >
      {/* 卡片 */}
      <div
        className={`
          bg-white rounded-2xl ring-1 ring-slate-200 shadow-xl w-full mx-auto
          transition-all duration-${ANIM_MS} ease-out
          ${animateIn ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-1 scale-95"}
        `}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200/80">
          <div className="flex items-center gap-2">
            <span className="inline-flex h-6 w-6 items-center justify-center rounded-md bg-mingdao-blue/10 text-mingdao-blue">
              {/* 資訊圖示（純裝飾） */}
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden="true">
                <path d="M11 7h2v2h-2V7zm0 4h2v6h-2v-6z" />
                <path d="M12 2C6.49 2 2 6.49 2 12s4.49 10 10 10 10-4.49 10-10S17.51 2 12 2zM4 12c0-4.41 3.59-8 8-8s8 3.59 8 8-3.59 8-8 8-8-3.59-8-8z" />
              </svg>
            </span>
            <h2 id="mdtc-dialog-title" className="text-lg md:text-xl font-bold text-slate-800">
              MDTC 訊息通知
            </h2>
          </div>

          <button
            onClick={onClose}
            aria-label="Close"
            className="p-1.5 rounded-xl text-slate-500 hover:text-slate-700 hover:bg-slate-100
                       focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mingdao-blue/50 transition"
          >
            <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="px-6 pt-5 pb-4 text-center">
          <p className="text-slate-700 text-base md:text-lg leading-relaxed">
            {message}
          </p>
        </div>

        {/* Footer */}
        <div className="flex flex-col sm:flex-row gap-3 px-6 pb-6">
          <button
            onClick={onClose}
            className="flex-1 min-w-[120px] inline-flex items-center justify-center px-4 py-2 rounded-xl
                       font-semibold text-white bg-mingdao-blue hover:bg-mingdao-blue-dark
                       transition shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mingdao-blue/50"
          >
            確定
          </button>
          <button
            onClick={() => router.push("/")}
            className="flex-1 min-w-[120px] inline-flex items-center justify-center px-4 py-2 rounded-xl
                       font-semibold bg-white text-mingdao-blue ring-1 ring-mingdao-blue hover:bg-mingdao-blue-light
                       transition shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mingdao-blue/40"
          >
            返回首頁
          </button>
        </div>
      </div>
    </dialog>
  );
}
