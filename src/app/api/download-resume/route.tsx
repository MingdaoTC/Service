// app/api/download-resume/route.ts
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const fileUrl = searchParams.get("url");
  const filename = searchParams.get("filename") || "resume.pdf";

  if (!fileUrl) {
    return new Response("缺少檔案 URL", { status: 400 });
  }

  try {
    const response = await fetch(fileUrl);

    if (!response.ok) {
      return new Response("檔案不存在", { status: 404 });
    }

    const buffer = await response.arrayBuffer();

    // 正確處理中文檔案名稱
    const encodedFilename = encodeURIComponent(filename);
    const contentDisposition = `attachment; filename*=UTF-8''${encodedFilename}`;

    return new Response(buffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": contentDisposition,
        "Cache-Control": "no-cache",
      },
    });
  } catch (error) {
    console.error("下載失敗:", error);
    return new Response("下載失敗", { status: 500 });
  }
}
