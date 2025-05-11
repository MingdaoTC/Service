"use client";

// Modules
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

// Components
import SimpleButton from "@/components/Global/Button/SimpleButton";

// Libraries
import { handleSignOut } from "@/library/auth/auth-actions";

// Types
import { AccountStatus, User, UserRole } from "@/prisma/client";

function UserDropdown({ user }: { user: User }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const role = {
    [UserRole.ADMIN]: "管理員",
    [UserRole.SUPERADMIN]: "超級管理員",
    [UserRole.GUEST]: "訪客",
    [UserRole.ALUMNI]: "校友",
    [UserRole.COMPANY]: "企業",
  };

  const status = {
    [AccountStatus.VERIFIED]: {
      text: "已驗證",
      color: "text-green-500",
    },
    [AccountStatus.INACTIVE]: {
      text: "已停用",
      color: "text-gray-500",
    },
    [AccountStatus.PENDING]: {
      text: "審核中",
      color: "text-yellow-500",
    },
    [AccountStatus.UNVERIFIED]: {
      text: "未驗證",
      color: "text-red-500",
    },
    [AccountStatus.BANNED]: {
      text: "永久封禁",
      color: "text-red-500",
    },
  };

  // 處理點擊事件 - 切換下拉選單
  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  // 處理點擊外部關閉下拉選單
  useEffect(() => {
    function handleClickOutside(event: any) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <SimpleButton
        onClick={toggleDropdown}
        className="flex items-center gap-1"
      >
        {user?.displayName}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className={`h-4 w-4 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </SimpleButton>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-auto rounded-md shadow-xl bg-white ring-1 ring-black ring-opacity-20 !z-[10000000]">
          <div className="py-2">
            <div className="flex px-4">
              <div className="w-12 h-12 mr-2">
                <img
                  src={user?.avatarUrl || "/images/default-avatar.png"}
                  alt="User Avatar"
                  className="rounded-full"
                />
              </div>
              <div className="flex flex-col justify-center">
                <h3 className="text-md font-semibold">{user.displayName}</h3>
                <p className="text-xs text-gray-500">{user.email}</p>
              </div>
            </div>
            <hr className="border-gray-300 my-2" />
            <div className="px-4 gap-1 flex flex-col">
              <p>
                登入身分：
                <span className="text-mingdao-blue-dark font-medium">
                  {role[user.role as keyof typeof role]}
                </span>
              </p>
              <p>
                驗證身分：
                <span
                  className={`font-medium ${
                    status[user.status as keyof typeof status].color
                  }`}
                >
                  {status[user.status as keyof typeof status].text}
                </span>
              </p>
            </div>
            {(user.role === UserRole.ADMIN ||
              user.role === UserRole.SUPERADMIN) && (
              <>
                <hr className="border-gray-300 my-2" />
                <div className="px-4 flex flex-col gap-1">
                  <Link
                    href="/admin"
                    className="w-full text-left text-md text-black hover:text-mingdao-blue"
                  >
                    管理員後台
                  </Link>
                </div>
              </>
            )}
            <hr className="border-gray-300 my-2" />
            <div className="flex flex-col px-4 gap-1">
              {user.status === AccountStatus.UNVERIFIED && (
                <Link
                  href="/register"
                  className="w-full text-left text-md text-black hover:text-mingdao-blue"
                >
                  申請驗證
                </Link>
              )}
              <Link
                href="/profile"
                className="w-full text-left text-md text-black hover:text-mingdao-blue"
              >
                我的帳號 (開發中)
              </Link>
            </div>

            <hr className="border-gray-300 my-2" />
            <form action={handleSignOut} className="px-4">
              <button
                type="submit"
                className="w-full text-left text-md text-black hover:text-red-500"
              >
                登出
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default UserDropdown;
