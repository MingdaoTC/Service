import { redirect } from "next/navigation";
import { useEffect, useRef } from "react";

const OperationInfoDialog = ({
  isOpen,
  onClose,
  message,
}: {
  isOpen: boolean;
  onClose: () => void;
  message: string;
}) => {
  const dialogRef = useRef<HTMLDialogElement | null>(null);

  useEffect(() => {
    if (isOpen && dialogRef.current) {
      dialogRef.current.showModal();
    } else if (dialogRef.current) {
      dialogRef.current.close();
    }
  }, [isOpen]);

  return (
    <dialog
      ref={dialogRef}
      className="w-full max-w-md rounded-lg p-6 backdrop:bg-black backdrop:bg-opacity-50"
    >
      <div className="flex flex-col items-center gap-5">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
          aria-label="Close"
        >
          ✕
        </button>
        <h2 className="text-2xl font-bold">MDTC 訊息通知</h2>
        <p className="text-gray-600 text-xl">{message}</p>
        <div className="flex gap-4 mt-4">
          <button
            onClick={onClose}
            className="py-2 px-4 rounded flex-1 min-w-[120px] text-center font-semibold border border-mingdao-blue bg-mingdao-blue text-white"
          >
            確定
          </button>
          <button
            onClick={() => redirect("/")}
            className="py-2 px-4 rounded flex-1 min-w-[120px] text-center font-semibold border border-mingdao-blue bg-transparent text-mingdao-blue"
          >
            返回首頁
          </button>
        </div>
      </div>
    </dialog>
  );
};

export default OperationInfoDialog;
