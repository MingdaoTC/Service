"use client";
import { useState } from "react";
import { getDownloadPresignedUrl } from "@/library/storage/preSign";

export default function ExpandableRow({
  app,
  resume,
}: {
  app: any;
  resume: any;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <div className="grid grid-cols-6 items-center text-sm px-4 py-3">
        <div className="col-span-2 break-words">{app.email}</div>
        <div className="col-span-1">{app.user?.name || "-"}</div>
        <div className="col-span-1">{app.status}</div>
        <div className="col-span-1">
          {new Date(app.createdAt).toLocaleString()}
        </div>
        <div className="col-span-1 flex justify-center">
          <button
            onClick={() => setOpen((v) => !v)}
            className="px-2 py-1 text-xs border border-blue-600 text-blue-600 rounded hover:bg-blue-50"
          >
            {open ? "收合" : "查看"}
          </button>
        </div>
      </div>
      {open && (
        <div className="bg-gray-50 text-left px-8 py-4 border-t">
          <div className="mb-2">
            <span className="font-semibold text-gray-700">自我推薦信：</span>
            <div className="whitespace-pre-line bg-white border rounded p-3 mt-1 text-gray-800">
              {app.coverLetter || (
                <span className="text-gray-400">無自我推薦信</span>
              )}
            </div>
          </div>
          <div className="mb-2">
            <span className="font-semibold text-gray-700">履歷：</span>
            {resume ? (
              <DownloadResumeButton
                objectKey={resume.objectKey}
                resumeName={resume.name}
              />
            ) : (
              <span className="text-gray-400 ml-2">無履歷</span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function DownloadResumeButton({
  objectKey,
  resumeName,
}: {
  objectKey: string;
  resumeName: string;
}) {
  const handleDownload = async () => {
    const url = await getDownloadPresignedUrl(objectKey, 5);
    const encodedUrl = encodeURIComponent(url);
    const filename = encodeURIComponent(`${resumeName || "resume"}.pdf`);
    const apiUrl = `/api/download-resume?url=${encodedUrl}&filename=${filename}`;
    window.open(apiUrl, "_blank");
  };
  return (
    <button
      onClick={handleDownload}
      className="px-3 py-1 bg-mingdao-blue text-white rounded hover:bg-blue-700 ml-2"
    >
      下載履歷
    </button>
  );
}
