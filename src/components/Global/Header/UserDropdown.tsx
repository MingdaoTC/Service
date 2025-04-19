"use client";

// Modules
import Link from "next/link";
import { useState, useRef, useEffect } from "react";

// Components
import SimpleButton from "@/components/Global/SimpleButton";

// Libraries
import { handleSignOut } from "@/lib/auth-actions";

// Types
import type { User } from "@/prisma/client";


function UserDropdown({ user }: { user: User }) {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const role = {
        guest: "訪客",
        alumni: "校友",
        company: "企業",
    }

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
            <SimpleButton onClick={toggleDropdown} className="flex items-center gap-1">
                {user?.displayName}
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </SimpleButton>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-auto rounded-md shadow-xl bg-white ring-1 ring-black ring-opacity-20 z-10">
                    <div className="py-4">
                        <div className="flex px-4">
                            <div className="w-12 h-12 mr-2">
                                <img
                                    src={user?.avatarUrl || "/images/default-avatar.png"}
                                    alt="User Avatar"
                                    className="rounded-full"
                                />
                            </div>
                            <div className="flex flex-col">
                                <h3 className="text-md font-semibold">{user.displayName}</h3>
                                <p className="text-xs text-gray-500">{user.email}</p>
                            </div>
                        </div>
                        <hr className="border-gray-300 my-2" />
                        <div className="px-4">
                            <p>
                                登入身分：<span className="text-mingdao-blue-dark font-medium">{role[user.role as keyof typeof role]}</span>
                            </p>
                            <p>
                                驗證身分：<span className={"font-medium " + (user.verified ? "text-green-500" : "text-red-500")}>{user.verified ? "已驗證" : "未驗證"}</span>
                            </p>
                        </div>
                        <hr className="border-gray-300 my-2" />
                        <div className="flex flex-col gap-2 px-4">
                            {!user.verified && (
                                <Link
                                    href="/register"
                                    className="w-full text-left text-md text-black hover:text-mingdao-blue"
                                >
                                    申請驗證
                                </Link>
                            )}
                            <Link
                                href="#"
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
            )
            }
        </div >
    );
}

export default UserDropdown;