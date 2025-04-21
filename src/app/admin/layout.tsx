"use client";

// Module
import React, { useState } from "react";
import { useRouter, usePathname } from "next/navigation";

// Icons
import { Activity, BadgeCheck, ShieldUser, User } from "lucide-react";

export default function AdminLayout({
  children,
}: Readonly<{
    children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const [activeTab, setActiveTab] = useState(pathname.split("/")[2] || "dashboard");
  const router = useRouter();

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    if (tab === "dashboard") {
      router.push("/admin");
    } else {
      router.push(`/admin/${tab}`);
    }
  };

  return (
    <div className="h-[calc(100dvh-6rem)] bg-blue-50">
      <div className="flex">
        <aside className="w-auto bg-white h-[calc(100vh-6rem)] shadow-sm flex-none">
          <nav className="p-4">
            <ul className="space-y-1">
              <li>
                <button
                  onClick={() => handleTabChange("dashboard")}
                  className={`flex items-center w-full px-4 py-3 rounded-lg text-left ${activeTab === "dashboard"
                    ? "bg-blue-100 text-blue-600"
                    : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <Activity className="w-5 h-5 mr-3" />
                  <span>網站狀態 (開發中)</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleTabChange("registration")}
                  className={`flex items-center w-full px-4 py-3 rounded-lg text-left ${activeTab === "registration"
                    ? "bg-blue-100 text-blue-600"
                    : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <BadgeCheck className="w-5 h-5 mr-3" />
                  <span>申請驗證審核</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleTabChange("users")}
                  className={`flex items-center w-full px-4 py-3 rounded-lg text-left ${activeTab === "users"
                    ? "bg-blue-100 text-blue-600"
                    : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <User className="w-5 h-5 mr-3" />
                  <span>使用者管理 (開發中)</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleTabChange("admins")}
                  className={`flex items-center w-full px-4 py-3 rounded-lg text-left ${activeTab === "admins"
                    ? "bg-blue-100 text-blue-600"
                    : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <ShieldUser className="w-5 h-5 mr-3" />
                  <span>管理員設定 (開發中)</span>
                </button>
              </li>
            </ul>
          </nav>
        </aside>
        <div className="flex flex-1 p-4 overflow-auto h-[calc(100vh-6rem)]">
          {children}
        </div>
      </div>
    </div>
  );
}
