"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";

const CDN_URL = process.env.NEXT_PUBLIC_CDN_URL;

export default function ShowImagePage() {
    const searchParams = useSearchParams();
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [imageSize, setImageSize] = useState({ width: 0, height: 0 });

    // 獲取圖片路徑參數
    const imagePath = searchParams.get("path");
    // 獲取圖片說明參數
    const imageTitle = searchParams.get("title") || "圖片查看器";

    // 完整圖片 URL
    const imageUrl = imagePath && CDN_URL ? `${CDN_URL}${imagePath}` : "";

    // 獲取檔案名稱並處理長檔案名在手機版的顯示
    const fileName = imagePath?.split("/").pop() || "未知";

    useEffect(() => {
        if (!imagePath) {
            setError("未提供圖片路徑");
            setIsLoading(false);
            return;
        }

        if (!CDN_URL) {
            setError("CDN URL 未配置");
            setIsLoading(false);
            return;
        }

        // 預加載圖片以獲取尺寸
        const img = new window.Image();
        img.onload = () => {
            setImageSize({ width: img.width, height: img.height });
            setIsLoading(false);
        };
        img.onerror = () => {
            setError("圖片加載失敗");
            setIsLoading(false);
        };
        img.src = imageUrl;
    }, [imagePath, imageUrl]);

    // 處理檔案名稱顯示，根據螢幕寬度截斷長檔案名
    const getTruncatedFileName = (fileName: any) => {
        return (
            <div className="truncate max-w-full">
                {fileName}
            </div>
        );
    };

    return (
        <div className="h-[calc(100dvh-6rem)] bg-gray-100 py-8 overflow-auto">
            <div className="max-w-7xl mx-auto px-4">
                {/* 導航頭部 */}
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-xl sm:text-2xl font-semibold text-mingdao-blue-dark">{imageTitle}</h1>
                    <button
                        onClick={() => window.history.back()}
                        className="px-4 py-2 bg-mingdao-blue text-white rounded hover:bg-mingdao-blue-dark transition"
                    >
                        返回
                    </button>
                </div>

                {/* 主內容區 */}
                <div className="bg-white shadow-sm rounded-lg border p-4">
                    {isLoading ? (
                        <div className="flex justify-center items-center h-96">
                            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-mingdao-blue"></div>
                        </div>
                    ) : error ? (
                        <div className="flex justify-center items-center h-96">
                            <div className="text-center">
                                <div className="text-red-500 text-5xl mb-4">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-medium text-gray-800 mb-2">圖片載入錯誤</h3>
                                <p className="text-gray-600">{error}</p>
                            </div>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center">
                            {/* 圖片信息 */}
                            <div className="mb-4 w-full bg-gray-50 p-3 rounded-lg">
                                <div className="gap-3 text-sm flex max-md:flex-col">
                                    <div className="overflow-hidden flex">
                                        <span className="text-gray-500 flex-none">圖片名稱：</span>
                                        {getTruncatedFileName(fileName)}
                                    </div>
                                    <div className="overflow-hidden flex flex-none">
                                        <span className="text-gray-500 flex-none">圖片尺寸：</span>
                                        <span>{imageSize.width} x {imageSize.height} 像素</span>
                                    </div>
                                </div>
                            </div>

                            {/* 圖片查看器 */}
                            <div className="relative w-full overflow-auto bg-slate-200 rounded-lg p-2 flex justify-center">
                                <div className="relative">
                                    {/* 使用原生 img 標籤以支持縮放和完整尺寸顯示 */}
                                    <img
                                        src={imageUrl}
                                        alt={imageTitle || "圖片"}
                                        className="max-w-full object-contain"
                                        style={{ maxHeight: 'calc(80vh - 200px)' }}
                                    />
                                </div>
                            </div>

                            {/* 下載按鈕 */}
                            <div className="mt-4 flex flex-wrap gap-4 max-[376px]:flex-col">
                                <a
                                    href={imageUrl}
                                    download={fileName}
                                    className="px-4 py-2 bg-gray-100 border border-gray-300 rounded text-gray-700 hover:bg-gray-200 transition flex items-center"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                    </svg>
                                    <span className="whitespace-nowrap mx-auto">下載圖片</span>
                                </a>
                                <a
                                    href={imageUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="px-4 py-2 bg-gray-100 border border-gray-300 rounded text-gray-700 hover:bg-gray-200 transition flex items-center"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                    </svg>
                                    <span className="whitespace-nowrap mx-auto">在新窗口打開</span>
                                </a>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}