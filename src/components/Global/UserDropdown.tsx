"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import SimpleButton from "@/components/Global/SimpleButton";
import { handleSignOut } from "@/lib/auth-actions";

function UserDropdown({ user }: { user: any }) {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

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
                <div className="absolute right-0 mt-2 w-48 rounded-md shadow-xl bg-white ring-1 ring-black ring-opacity-20 z-10">
                    <div className="py-1">
                        <Link
                            href="/register"
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                            申請驗證
                        </Link>
                        <Link
                            href="#"
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                            我的帳號 (開發中)
                        </Link>
                        <form action={handleSignOut}>
                            <button
                                type="submit"
                                className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
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