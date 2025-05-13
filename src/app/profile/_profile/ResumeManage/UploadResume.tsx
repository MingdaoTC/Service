"use client";
import { useRef, useState } from "react";

export default function UploadResume() {
  const fileRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const [fileName, setFileName] = useState<string>("選擇檔案");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFileName(e.target.files[0].name);
    } else {
      setFileName("選擇檔案");
    }
  };

  const handleNewResumeForm = () => {
    return;
  };

  return (
    <div className="flex flex-col items-start gap-4">
      <h1 className="text-3xl text-gray-900">管理你的履歷</h1>
      <form
        action={handleNewResumeForm}
        ref={formRef}
        className="flex flex-col p-4 gap-3 rounded-lg w-full bg-mingdao-blue-light"
      >
        <h2 className="text-xl text-mingdao-blue-dark font-bold">上傳新履歷</h2>
        <div className="flex flex-col md:flex-row gap-4 w-full">
          <div className="flex-1 flex flex-col gap-1">
            <label htmlFor="title" className="text-mingdao-blue-dark">
              履歷名稱
            </label>
            <input
              type="text"
              id="title"
              className="border border-gray-300 rounded p-2 w-full"
            />
          </div>
          <div className="flex flex-col gap-1 md:w-44">
            <p className="text-mingdao-blue-dark">上傳履歷</p>
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
              className="hidden"
              onChange={handleFileChange}
            />
          </div>
        </div>
        <button
          type="submit"
          className="px-4 py-2 bg-mingdao-blue text-white rounded border-mingdao-blue border hover:bg-transparent hover:text-mingdao-blue transition duration-300 ease-in-out"
        >
          上傳
        </button>
      </form>
    </div>
  );
}
