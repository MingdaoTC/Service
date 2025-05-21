"use client";
import OperationInfoDialog from "@/components/Global/OperationInfoDialog";
import { useRef, useState } from "react";
import { createNewResume } from "../actions/createNewResume";

import { resumeFileSizeLimit } from "../limitationConfig";

export default function UploadResume() {
  const fileRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const [fileName, setFileName] = useState<string>("選擇檔案");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogMessage, setDialogMessage] = useState("");
  const [isPending, setIsPending] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFileName(e.target.files[0].name);
    } else {
      setFileName("選擇檔案");
    }
  };

  const handleNewResumeForm = async (formData: FormData) => {
    setIsPending(true);
    if (
      !fileRef.current ||
      !fileRef.current.files ||
      !fileRef.current.files[0]
    ) {
      setErrorMessage("請選擇檔案");
      return;
    }

    if (fileRef.current?.files[0].size > resumeFileSizeLimit) {
      setErrorMessage("檔案大小不得超過 5MB");
      setIsPending(false);
      return;
    }

    const resume = await createNewResume(formData);

    if (resume?.error) {
      setErrorMessage(resume.error);
      setIsPending(false);
      return;
    }

    setIsPending(false);
    setDialogMessage("上傳成功");
    setIsDialogOpen(true);
  };

  return (
    <div className="flex flex-col items-start gap-4">
      <OperationInfoDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        message={dialogMessage}
      />
      <h1 className="text-3xl text-gray-900">管理你的履歷</h1>
      <form
        onSubmit={(e) => {
          e.preventDefault(); // 防止默認的表單提交行為
          const formData = new FormData(formRef.current as HTMLFormElement);
          handleNewResumeForm(formData);
        }}
        ref={formRef}
        className="flex flex-col p-4 gap-3 rounded-lg w-full bg-mingdao-blue-light"
      >
        <h2 className="text-xl text-mingdao-blue-dark font-bold">上傳新履歷</h2>
        <span
          className="text-red-500 transition-opacity duration-300 bg-red-200 py-1 px-4 rounded-full"
          style={{
            opacity: errorMessage ? 1 : 0,
          }}
        >
          {errorMessage}
        </span>
        <div className="flex flex-col md:flex-row gap-4 w-full">
          <div className="flex-1 flex flex-col gap-1">
            <label htmlFor="title" className="text-mingdao-blue-dark">
              履歷名稱
            </label>
            <input
              type="text"
              id="title"
              name="title"
              className="border border-gray-300 rounded p-2 w-full"
              required
            />
          </div>
          <div className="flex flex-col gap-1 md:w-44">
            <p className="text-mingdao-blue-dark">上傳履歷 (PDF)</p>
            <label
              htmlFor="file"
              className="block w-full px-4 py-2 bg-mingdao-blue text-white rounded cursor-pointer border-mingdao-blue border hover:bg-transparent hover:text-mingdao-blue transition duration-300 ease-in-out text-center whitespace-nowrap overflow-hidden text-ellipsis"
              title={fileName}
            >
              {fileName}
            </label>
            <input
              ref={fileRef}
              type="file"
              id="file"
              name="resume"
              className="hidden"
              onChange={handleFileChange}
              accept=".pdf"
              required
            />
          </div>
        </div>
        <button
          type="submit"
          disabled={isPending}
          className={`px-4 py-2 ${
            isPending
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-mingdao-blue hover:bg-transparent hover:text-mingdao-blue"
          } text-white rounded border-mingdao-blue border transition duration-300 ease-in-out`}
        >
          {isPending ? "上傳中..." : "上傳"}
        </button>
      </form>
    </div>
  );
}
