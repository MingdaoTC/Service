// LoginPromptDialog.jsx
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

const LoginPromptDialog = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();

  const dialogRef = useRef<HTMLDialogElement | null>(null);

  useEffect(() => {
    console.log(isOpen);
    if (isOpen && dialogRef.current) {
      dialogRef.current.showModal();
    } else if (dialogRef.current) {
      dialogRef.current.close();
    }
  }, [isOpen]);

  const handleLogin = () => {
    setIsLoading(true);
    // 使用 server action 來處理登入
    signIn("google")
      .catch((error) => {
        console.error("登入失敗:", error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleGoHome = () => {
    router.push("/");
  };
  return (
    <dialog
      ref={dialogRef}
      className="w-full max-w-md rounded-lg p-6 backdrop:bg-black backdrop:bg-opacity-50"
    >
      <div className="flex flex-col items-center">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
          aria-label="Close"
        >
          ✕
        </button>
        <h2 className="mb-2 text-gray-800 text-2xl font-semibold">請先登入</h2>
        <p className="mb-5 text-gray-600">您需要登入才能使用此功能</p>
        <div className="flex gap-5 justify-center w-full">
          <button
            onClick={handleGoHome}
            className="py-3 px-4 rounded flex-1 min-w-[120px] text-center font-semibold text-mingdao-blue border border-mingdao-blue hover:bg-gray-100 transition-all duration-300"
          >
            返回首頁
          </button>
          <button
            onClick={handleLogin}
            className="py-3 px-4 rounded flex-1 min-w-[120px] text-center font-semibold text-white bg-mingdao-blue hover:bg-mingdao-blue-dark transition-all duration-300"
          >
            前往登入
          </button>
        </div>
      </div>
    </dialog>
  );
};

export default LoginPromptDialog;
