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
      setIsPending(false);
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

      <h1 className="text-2xl font-bold text-slate-800">履歷管理</h1>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          const formData = new FormData(formRef.current as HTMLFormElement);
          handleNewResumeForm(formData);
        }}
        ref={formRef}
        className="flex flex-col gap-3 w-full rounded-xl bg-blue-50/70 ring-1 ring-slate-200 p-4"
      >
        <h2 className="text-lg md:text-xl text-slate-800 font-semibold">上傳新履歷</h2>

        <span
          className="text-red-600 transition-opacity duration-300 bg-red-50 border border-red-200 py-1 px-3 rounded-lg"
          style={{ opacity: errorMessage ? 1 : 0 }}
        >
          {errorMessage}
        </span>

        <div className="flex flex-col md:flex-row gap-4 w-full">
          <div className="flex-1 flex flex-col gap-1">
            <label htmlFor="title" className="text-sm font-medium text-slate-600">
              履歷名稱
            </label>
            <input
              type="text"
              id="title"
              name="title"
              className="w-full rounded-lg ring-1 ring-slate-200 px-3 py-2 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-300"
              required
            />
          </div>

          <div className="flex flex-col gap-1 w-28">
            <p className="text-sm font-medium text-slate-600">上傳履歷 (PDF)</p>

            <label
              htmlFor="file"
              className="block w-full px-4 py-2 rounded-lg text-white text-center cursor-pointer bg-blue-600 hover:opacity-90 shadow-sm hover:rounded-none transition-all"
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
          className="inline-flex items-center justify-center px-4 py-2 rounded-lg font-semibold text-white bg-blue-600 hover:opacity-90 transition shadow-sm disabled:opacity-60 disabled:cursor-not-allowed hover:rounded-none"
        >
          {isPending ? "上傳中..." : "上傳"}
        </button>
      </form>
    </div>
  );
}
