"use client";

import { usePathname, useRouter } from "next/navigation";
// Module
import React, { useState, useEffect } from "react";

import Footer from "@/components/Global/Footer";
// Icons
import {
  Activity,
  BadgeCheck,
  LucideIcon,
  Menu as MenuIcon,
  ShieldUser,
  Store,
  User,
  X,
} from "lucide-react";

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
    id: "dashboard",
    label: "網站狀態",
    icon: Activity,
    path: "/admin",
    beta: false,
    disabled: false,
  },
  {
    id: "registration",
    label: "申請驗證審核",
    icon: BadgeCheck,
    path: "/admin/registration",
    beta: false,
    disabled: false,
  },
  {
    id: "companie",
    label: "企業管理",
    icon: Store,
    path: "/admin/company",
    beta: false,
    disabled: false,
  },
  {
    id: "users",
    label: "使用者管理",
    icon: User,
    path: "/admin/users",
    beta: false,
    disabled: false,
  },
  {
    id: "admins",
    label: "管理員設定",
    icon: ShieldUser,
    path: "/admin/admins",
    beta: false,
    disabled: false,
  },
  
  // {
  //   id: "help",
  //   label: "幫助中心",
  //   icon: HelpCircle,
  //   onClick: () => window.open('https://help.example.com', '_blank')
  // }
];

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const router = useRouter();
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // 新增 isLoading 狀態

  // 確定當前活動頁籤的函數
  // 確定當前活動頁籤的函數 - 修復版本
  const getActiveTabFromPath = (path: string) => {
    // 處理根路徑 /admin
    if (path === "/admin") {
      return "dashboard";
    }

    // 先嘗試完全匹配
    const exactMatchedItem = menuItems.find((item) => item.path === path);
    if (exactMatchedItem) {
      return exactMatchedItem.id;
    }

    // 如果沒有完全匹配，嘗試前綴匹配
    // 找到所有可能的匹配項，選擇路徑最長的那個（最具體的匹配）
    const prefixMatches = menuItems.filter((item) => {
      if (!item.path) return false;
      // 確保路徑以 item.path 開頭，並且下一個字符是 '/' 或者已經結束
      return path.startsWith(item.path) &&
        (path.length === item.path.length || path[item.path.length] === '/');
    });

    if (prefixMatches.length > 0) {
      // 選擇路徑最長的匹配項（最具體的匹配）
      const bestMatch = prefixMatches.reduce((prev, current) =>
        (current.path?.length || 0) > (prev.path?.length || 0) ? current : prev
      );
      return bestMatch.id;
    }

    // 處理 /admin/xxx 格式的路徑 (備用方案)
    const segments = path.split("/");
    if (segments.length >= 3 && segments[1] === "admin") {
      const potentialId = segments[2];
      const menuItem = menuItems.find((item) => item.id === potentialId);
      if (menuItem) {
        return menuItem.id;
      }
    }

    // 默認返回 dashboard
    return "dashboard";
  };

  // 監聽窗口大小變化
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
      setIsLoading(false); // 在檢查完螢幕尺寸後將 isLoading 設為 false
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
            ${item.disabled
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

  // 如果還在加載中，顯示加載界面或返回空
  if (isLoading) {
    return (
      <div className="bg-blue-50 flex items-center justify-center h-[calc(100dvh-3rem)]">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-500 border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]">
          <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
            載入中...
          </span>
        </div>
      </div>
    );
  }

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
      {/* 主內容區域 */}
      <div className="h-[calc(100dvh-3rem)] flex flex-col overflow-auto w-full">
        <div className="flex-none min-h-[calc(100dvh-15rem)] p-4 w-full">
          {children}
        </div>
        <Footer />
      </div>
    </div>
  );
}
