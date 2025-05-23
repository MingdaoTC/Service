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

    // 直接開啟下載連結
    window.open(apiUrl, "_blank");
  };

  return (
    <div className="flex items-center justify-between py-2 px-4 bg-gray-100 border rounded-lg border-gray-300">
      <p className="text-lg font-bold text-mingdao-blue-dark">{resumeName}</p>

      <button
        onClick={handleDownload}
        className="px-4 py-2 bg-mingdao-blue text-white rounded-md transition hover:bg-transparent hover:text-mingdao-blue border border-mingdao-blue"
      >
        下載履歷
      </button>
    </div>
  );
}
