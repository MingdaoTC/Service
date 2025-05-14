import { getUrlByObjectKey } from "@/library/r2UrlCache/getUrl";
import Link from "next/link";

export default async function ResumeItem({
  resumeName,
  resumeKey,
}: {
  resumeName: string;
  resumeKey: string;
}) {
  return (
    <div className="flex items-center justify-between py-2 px-4 bg-gray-100 border rounded-lg border-gray-300">
      <p className="text-lg font-bold text-mingdao-blue-dark">{resumeName}</p>
      <Link
        href={(await getUrlByObjectKey(resumeKey)) as string}
        className="px-4 py-2 bg-mingdao-blue text-white rounded-md transition hover:bg-transparent hover:text-mingdao-blue border border-mingdao-blue"
      >
        下載
      </Link>
    </div>
  );
}
