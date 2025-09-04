"use client";

export default function Footer() {
  const sponsors = [
    { name: "明道中學", logo: "/images/mingdao-logo.png" },
    { name: "明道中學校友會", logo: "/images/alumni-association-logo.png" },
    { name: "明道中學家長會", logo: "/images/parents-association-logo.png" },
    { name: "明道文教基金會", logo: "/images/mingdao-education-logo.png" },
  ];

  return (
    <footer className="mt-auto w-full bg-white/50 backdrop-blur border-t border-slate-200 text-slate-700 py-8">
      <div className="w-[98%] sm:w-[95%] max-w-6xl mx-auto px-2 sm:px-0">
        <div className="mb-6">
          <h3 className="text-base font-semibold text-slate-500 mb-3 text-center tracking-wide">
            共同開發
          </h3>

          <div className="flex flex-wrap justify-center items-center gap-4">
            {sponsors.map((sponsor, index) => (
              <div
                key={index}
                className="flex items-center space-x-2 rounded-lg bg-white ring-1 ring-slate-200 px-3 py-2 shadow-sm hover:shadow-md transition-all duration-200"
                title={sponsor.name}
              >
                <img
                  src={sponsor.logo}
                  alt={`${sponsor.name} logo`}
                  className="h-8 sm:h-9 w-auto object-contain"
                  onError={(e) => {
                    // 如果圖片載入失敗，顯示文字
                    const img = e.target as HTMLImageElement;
                    img.style.display = "none";
                    if (
                      img.nextSibling &&
                      img.nextSibling instanceof HTMLElement
                    ) {
                      (img.nextSibling as HTMLElement).style.display = "block";
                    }
                  }}
                />
                <span className="text-sm text-slate-700 hidden">
                  {sponsor.name}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* 分隔線 */}
        <div className="border-t border-slate-200 my-4 w-80 mx-auto" />

        {/* 版權資訊 */}
        <div className="text-center">
          <p className="text-sm text-slate-600">
            © {new Date().getFullYear()} 明道人才雲 - 打造理想職涯
          </p>
        </div>

        {/* 額外連結 (可選) */}
        <div className="flex justify-center space-x-4 mt-3 text-xs">
          <a
            href="/privacy-policy"
            className="text-slate-600 hover:text-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-300 rounded"
          >
            隱私政策
          </a>
          <span className="text-slate-300">|</span>
          <a
            href="/terms-of-service"
            className="text-slate-600 hover:text-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-300 rounded"
          >
            服務條款
          </a>
          {/* <span className="text-slate-300">|</span>
          <a
            href="#"
            className="text-slate-600 hover:text-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-300 rounded"
          >
            聯繫我們
          </a> */}
        </div>
      </div>
    </footer>
  );
}
