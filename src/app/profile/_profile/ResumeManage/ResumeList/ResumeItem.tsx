import Link from "next/link";

export default function ResumeItem({
  resumeName,
  resumeUrl,
}: {
  resumeName: string;
  resumeUrl: string;
}) {
  return (
    <div className="flex items-center justify-between py-2 px-4 bg-gray-100 border rounded-lg border-gray-300">
      <p className="text-lg font-bold text-mingdao-blue-dark">{resumeName}</p>
      <Link
        href={resumeUrl}
        className="px-4 py-2 bg-mingdao-blue text-white rounded-md transition hover:bg-transparent hover:text-mingdao-blue border border-mingdao-blue"
      >
        下載
      </Link>
    </div>
  );
}
