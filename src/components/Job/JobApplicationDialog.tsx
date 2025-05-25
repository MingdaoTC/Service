import { Resume } from "@/prisma/client";
import { ChangeEvent, FormEvent, useEffect, useRef, useState } from "react";

type JobApplicationDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (formElements: HTMLFormControlsCollection) => void;

  jobData: {
    title: string;
    company: string;
  };
  resumeList: Resume[];
};

const JobApplicationDialog = ({
  isOpen,
  onClose,
  onSubmit,
  jobData,
  resumeList = [],
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

  const [recommendationText, setRecommendationText] = useState<string>(
    "您好，我叫[姓名]，近日得知貴公司在徵人，希望能有參加面試的機會，謝謝！"
  );
  const maxLength = 2000;

  const handleTextChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value;
    if (newText.length <= maxLength) {
      setRecommendationText(newText);
    }
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
          <h3 className="text-lg font-medium mb-4">選擇履歷</h3>
          <div className="border rounded-lg p-4 bg-gray-50">
            <select name="resume" id="resume" className="w-full bg-transparent">
              <option value="">請選擇履歷</option>
              {resumeList.map((resume) => (
                <option key={resume.id} value={resume.id}>
                  {resume.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-medium mb-4">自我推薦信</h3>

          <div className="border rounded-lg p-4 bg-gray-50">
            <textarea
              className="w-full min-h-[100px] bg-gray-50 resize-none border-none focus:ring-0 outline-none"
              value={recommendationText}
              onChange={handleTextChange}
              maxLength={maxLength}
            />
            <div className="text-right text-gray-500 text-sm">
              {recommendationText.length}/{maxLength}
            </div>
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
              <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
            </svg>
            確認送出
          </button>
        </div>
      </form>
    </dialog>
  );
};

export default JobApplicationDialog;
