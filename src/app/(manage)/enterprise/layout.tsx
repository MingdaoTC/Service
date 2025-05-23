"use client";

import { useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
// Module
import React, { useState, useEffect } from "react";

// Icons
import { LucideIcon, Menu as MenuIcon, SquarePen, User, X } from "lucide-react";

// Types
import { Company, User as TUser, UserRole } from "@/prisma/client";

import { getCompanyData } from "@/app/(manage)/enterprise/_enterprise/action/fetch";

// Components
import Button from "@/components/Global/Button/Button";
import Footer from "@/components/Global/Footer";

// 菜单配置类型定义 - 簡化後的版本
type MenuItem = {
  id: string; // 路由 ID
  label: string; // 顯示的標籤
  icon: LucideIcon; // 圖標組件
  path?: string; // 路徑 (為空時使用 /admin/{id})
  disabled?: boolean; // 是否禁用（無法點擊）
  beta?: boolean; // 是否為開發中功能
  onClick?: () => void; // 可選的自定義點擊處理函數
};

// 集中管理的菜單配置
const menuItems: MenuItem[] = [
  {
    id: "information",
    label: "公司資料管理",
    icon: SquarePen,
    path: "/enterprise",
    beta: false,
    disabled: false,
  },
  {
    id: "jobs",
    label: "工作職缺管理",
    icon: User,
    path: "/enterprise/jobs",
    beta: false,
    disabled: false,
  },
];

export default function EnterpriseLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const router = useRouter();
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [company, setCompany] = useState<Company>();

  const { data: session } = useSession();
  const user = session?.user as TUser;
  const isSuperAdmin = user?.role === UserRole.SUPERADMIN;

  // 確定當前活動頁籤的函數
  const getActiveTabFromPath = (path: string) => {
    if (path === "/enterprise") {
      return "information";
    }

    // 查找匹配的菜單項
    const matchedItem = menuItems.find((item) => item.path === path);
    if (matchedItem) {
      return matchedItem.id;
    }

    // 處理 /admin/xxx 格式的路徑
    const segments = path.split("/");
    if (segments.length >= 3 && segments[1] === "enterprise") {
      const potentialId = segments[2];
      const menuItem = menuItems.find((item) => item.id === potentialId);
      if (menuItem) {
        return menuItem.id;
      }
    }

    // 默認返回 dashboard
    return "information";
  };

  useEffect(() => {
    (async () => {
      const company = await getCompanyData();
      if (company) {
        setCompany(company);
      }
    })();
  }, []);

  // 監聽窗口大小變化
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    // 初始檢查
    checkScreenSize();

    // 添加監聽器
    window.addEventListener("resize", checkScreenSize);

    // 清理監聽器
    return () => {
      window.removeEventListener("resize", checkScreenSize);
    };
  }, []);

  // 獲取當前頁面標題
  const getCurrentPageTitle = () => {
    const activeTab = getActiveTabFromPath(pathname);
    const currentItem = menuItems.find((item) => item.id === activeTab);
    return currentItem ? currentItem.label : "";
  };

  const handleTabChange = (item: MenuItem) => {
    // 如果禁用，直接返回，不做任何操作
    if (item.disabled) {
      return;
    }

    // 如果在移動設備上，關閉選單
    if (isMobile) {
      setShowMobileMenu(false);
    }

    // 如果有自定義點擊處理函數，執行它
    if (item.onClick) {
      item.onClick();
      return;
    }

    // 否則執行默認導航
    router.push(item.path || `/admin/${item.id}`);
  };

  const toggleMobileMenu = () => {
    setShowMobileMenu(!showMobileMenu);
  };

  const handleGoAdminPage = () => {
    router.push("/admin");
  };

  if (isSuperAdmin && !company) {
    return (
      <div className="relative w-full h-[calc(100vh-3rem)] flex items-center justify-center">
        <div className="fixed top-0 left-0 w-full h-full bg-white/70 backdrop-blur-sm flex items-center justify-center z-[1000] overflow-hidden mt-12">
          <div className="bg-white p-8 rounded-lg shadow-md text-center max-w-md w-[90%] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <h2 className="text-xl font-bold mb-2">管理員通知</h2>
            <p>
              目前無法獲取公司資料
              <br />
              請稍後再試或聯繫客服人員
              <br />
              如果您是管理員且無管理中的公司行號
              <br />
              請忽略此通知
            </p>
            <div className="flex gap-5 justify-center mt-5 w-full">
              <Button
                onClick={handleGoAdminPage}
                className="py-3 px-0 rounded-lg text-base font-semibold cursor-pointer transition-all duration-300 flex-1 min-w-[120px] text-center bg-[var(--primary-color)] text-white border-none hover:rounded-none"
                type="primary"
              >
                前往管理員後台
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 渲染菜單項
  const renderMenuItem = (item: MenuItem, index: number) => {
    const Icon = item.icon;
    const activeTab = getActiveTabFromPath(pathname);

    return (
      <li key={index}>
        <button
          onClick={() => handleTabChange(item)}
          disabled={item.disabled}
          className={`
            flex items-center w-full px-4 py-3 rounded-lg text-left 
            ${
              item.disabled
                ? "opacity-50 cursor-not-allowed hover:cursor-not-allowed bg-transparent hover:bg-transparent text-gray-500"
                : activeTab === item.id
                  ? "bg-blue-100 text-blue-600 font-medium"
                  : "text-gray-700 hover:bg-gray-100"
            }
            transition-colors duration-150
          `}
        >
          <Icon className="w-5 h-5 mr-3 flex-shrink-0" />
          <span className="truncate">
            {item.label} {item.beta && "(開發中)"}
          </span>
        </button>
      </li>
    );
  };

  return (
    <div className="bg-blue-50 flex flex-col md:flex-row h-[calc(100dvh-3rem)]">
      {/* 手機板頂部導航欄 */}
      {isMobile && (
        <div className="bg-white w-full shadow-sm p-3 flex items-center justify-between h-[3.5rem]">
          <h1 className="text-lg font-semibold text-gray-800">
            {getCurrentPageTitle()}
          </h1>
          <button
            onClick={toggleMobileMenu}
            className="p-1 rounded-md text-gray-700 hover:bg-gray-100"
            aria-label="顯示選單"
          >
            <MenuIcon className="w-6 h-6" />
          </button>
        </div>
      )}

      {/* 電腦版側邊欄 */}
      {!isMobile && (
        <aside className="w-64 bg-white shadow-sm h-[calc(100vh-3rem)] flex-shrink-0">
          <nav className="p-4">
            <ul className="space-y-1">{menuItems.map(renderMenuItem)}</ul>
          </nav>
        </aside>
      )}

      {/* 手機板的選單彈出層 */}
      {isMobile && showMobileMenu && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-800 bg-opacity-50">
          <div className="bg-white rounded-lg w-11/12 max-w-md overflow-hidden shadow-lg">
            <div className="flex justify-between items-center p-4 border-b">
              <h3 className="text-lg font-semibold">選單</h3>
              <button
                onClick={toggleMobileMenu}
                className="p-1 rounded-full hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4">
              <ul className="space-y-2">{menuItems.map(renderMenuItem)}</ul>
            </div>
          </div>
        </div>
      )}

      {/* 主要內容區域 */}
      <div className="h-[calc(100dvh-3rem)] flex flex-col overflow-auto w-full">
        <div className="flex-none min-h-[calc(100dvh-15rem)] p-4 w-full">
          {children}
        </div>
        <Footer />
      </div>
    </div>
  );
}
