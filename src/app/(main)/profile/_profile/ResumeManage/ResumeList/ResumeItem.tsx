"use client";

import { getDownloadPresignedUrl } from "@/library/storage/preSign";

export default function ResumeItem({
  resumeName,
  resumeKey,
}: {
  resumeName: string;
  resumeKey: string;
}) {
  const handleDownload = async () => {
    const downloadUrl = await getDownloadPresignedUrl(resumeKey, 5);
    const encodedUrl = encodeURIComponent(downloadUrl);
    const filename = encodeURIComponent(`${resumeName}.pdf`);
    const apiUrl = `/api/download-resume?url=${encodedUrl}&filename=${filename}`;

    window.open(apiUrl, "_blank");
  };

  return (
    <div className="flex items-center justify-between gap-3 px-4 py-3 bg-white rounded-xl ring-1 ring-slate-200 shadow-sm hover:shadow-md transition">
      <p className="text-base md:text-lg font-semibold text-slate-800">
        {resumeName}
      </p>

      <button
        onClick={handleDownload}
        className="inline-flex items-center justify-center px-3 md:px-4 py-2 rounded-lg font-semibold text-white bg-blue-600 hover:opacity-90 shadow-sm ring-1 ring-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-300 transition-all hover:rounded-none"
      >
        下載履歷
      </button>
    </div>
  );
}
