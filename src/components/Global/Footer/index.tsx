'use client';

export default function Footer() {
  const sponsors = [
    { name: "明道中學", logo: "/images/mingdao-logo.png" },
    { name: "明道中學校友會", logo: "/images/alumni-association-logo.png" },
    { name: "明道中學家長會", logo: "/images/parents-association-logo.png" },
    { name: "明道文教基金會", logo: "/images/mingdao-education-logo.png" }
  ];

  return (
    <footer className="bg-gray-200 bg-opacity-75 text-gray-800 py-6 mt-auto">
      <div className="w-[98%] sm:w-[95%] max-w-5xl mx-auto">
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-gray-600 mb-3 text-center">
            共同開發
          </h3>
          <div className="flex flex-wrap justify-center items-center gap-6 md:gap-8">
            {sponsors.map((sponsor, index) => (
              <div
                key={index}
                className="flex items-center space-x-2 hover:opacity-80 transition-opacity duration-200"
              >
                <img
                  src={sponsor.logo}
                  alt={`${sponsor.name} logo`}
                  className="h-8 w-auto object-contain"
                  onError={(e) => {
                    // 如果圖片載入失敗，顯示文字
                    const img = e.target as HTMLImageElement;
                    img.style.display = 'none';
                    if (img.nextSibling && img.nextSibling instanceof HTMLElement) {
                      (img.nextSibling as HTMLElement).style.display = 'block';
                    }
                  }}
                />
                <span className="text-sm text-gray-700 hidden">
                  {sponsor.name}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* 分隔線 */}
        <div className="border-t border-gray-300 mb-4"></div>

        {/* 版權資訊 */}
        <div className="text-center">
          <p className="text-sm">
            © {new Date().getFullYear()} 明道人才雲 - 打造理想職涯
          </p>
        </div>

        {/* 額外連結 (可選) */}
        <div className="flex justify-center space-x-4 mt-3 text-xs">
          <a href="#" className="text-gray-600 hover:text-gray-800 transition-colors">
            隱私政策
          </a>
          <span className="text-gray-400">|</span>
          <a href="#" className="text-gray-600 hover:text-gray-800 transition-colors">
            服務條款
          </a>
          <span className="text-gray-400">|</span>
          <a href="#" className="text-gray-600 hover:text-gray-800 transition-colors">
            聯繫我們
          </a>
        </div>
      </div>
    </footer>
  );
}