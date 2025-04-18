import { useRef, useEffect, FormEvent } from "react";

type JobApplicationDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (formElements: HTMLFormControlsCollection) => void;

  jobData: {
    title: string;
    company: string;
    location: string;
    seniority: string;
    education: string;
    salary: string;
  };
};

const JobApplicationDialog = ({
  isOpen,
  onClose,
  onSubmit,
  jobData,
}: JobApplicationDialogProps) => {
  const dialogRef = useRef<HTMLDialogElement | null>(null);

  useEffect(() => {
    if (isOpen && dialogRef.current) {
      dialogRef.current.showModal();
    } else if (dialogRef.current) {
      dialogRef.current.close();
    }
  }, [isOpen]);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit((e.target as HTMLFormElement).elements);
    onClose();
  };

  return (
    <dialog
      ref={dialogRef}
      className="w-full max-w-2xl rounded-lg p-0 backdrop:bg-black backdrop:bg-opacity-50"
    >
      <div className="bg-mingdao-blue-light px-4 py-6">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
          aria-label="Close"
        >
          ✕
        </button>
        <h2 className="text-center text-blue-800 text-xl font-medium">
          {jobData.title}
        </h2>
        <div className="text-center text-gray-600">
          <span className="inline-flex items-center">{jobData.company}</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-6">
        <div className="mb-6">
          <h3 className="text-lg font-medium mb-4">上傳履歷</h3>
          <div className="border rounded-lg p-4 bg-gray-50">
            <div className="flex items-center justify-center w-full">
              <label
                htmlFor="resume"
                className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50"
              >
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <p className="mb-2 text-sm text-gray-500">
                    <span className="font-semibold">點擊上傳</span> 或拖放檔案
                  </p>
                  <p className="text-xs text-gray-500">目前僅支援 PDF</p>
                </div>
                <input
                  id="resume"
                  type="file"
                  className="hidden"
                  accept=".pdf,.doc,.docx"
                />
              </label>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-medium mb-4">自我推薦信</h3>

          <div className="border rounded-lg p-4 bg-gray-50">
            <textarea className="w-full min-h-[100px] bg-gray-50 resize-none border-none focus:ring-0"></textarea>
            <div className="text-right text-gray-500 text-sm">35/2000</div>
          </div>

          <div className="mt-4 flex items-start space-x-6">
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                className="rounded border-gray-300 text-blue-600"
              />
              <span className="ml-2">儲存此次修改</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                className="rounded border-gray-300 text-blue-600"
              />
              <span className="ml-2">新增自我推薦信</span>
            </label>
          </div>
        </div>

        <div className="flex justify-between pt-4 border-t">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2 border border-mingdao-blue-dark  rounded-md text-mingdao-blue-dark font-medium"
          >
            取消
          </button>
          <button
            type="submit"
            className="px-6 py-2 bg-mingdao-blue-dark  rounded-md text-white font-medium flex items-center"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"></path>
            </svg>
            確認送出
          </button>
        </div>
      </form>
    </dialog>
  );
};

export default JobApplicationDialog;
