import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";

type RegistrationDialogProps = {
  isOpen: boolean;
  title: string;
  message: string;
  backHome: boolean;
};

export default function RegistrationDialog({
  isOpen,
  title,
  message,
  backHome,
}: RegistrationDialogProps) {
  const dialogRef = useRef<HTMLDialogElement | null>(null);
  const router = useRouter();

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
      className="w-full max-w-md rounded-lg p-0 backdrop:bg-black backdrop:bg-opacity-50"
    >
      <div className="bg-mingdao-blue-light px-4 py-4">
        {/* <button
          onClick={onClose}
          className="absolute top-2 right-4 text-gray-500 hover:text-gray-700"
          aria-label="Close"
        >
          ✕
        </button> */}
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <svg
              className="w-8 h-8 text-green-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h2 className="text-center text-blue-800 text-xl font-medium">
            {/* 審核資料已送出成功 */}
            {title}
          </h2>
        </div>
      </div>

      <div className="border-t pt-4 text-center text-gray-500">
        {/* biome-ignore lint/security/noDangerouslySetInnerHtml: <explanation> */}
        <div dangerouslySetInnerHTML={{ __html: message }} />
        {/* <p>我們已收到您的申請資料，將會盡快審核</p>
        <p>審核完畢我們將會透過您留下的資料聯絡您</p> */}
      </div>
      <div className="flex justify-center pt-4 mt-2">
        <button
          type="button"
          onClick={() => {
            if (backHome) {
              router.push("/");
            } else {
              if (dialogRef.current) {
                dialogRef.current.close();
              }
            }
          }}
          className="px-6 py-2 bg-mingdao-blue rounded-md text-white font-medium mb-4"
        >
          {backHome ? "返回首頁" : "關閉"}
        </button>
      </div>
    </dialog>
  );
}
