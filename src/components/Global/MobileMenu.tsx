"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Button from "@/components/Global/Button";
import { handleSignIn } from "@/lib/auth-actions";
import { navConfig } from "@/config/header";

export default function MobileMenu({ user }: { user?: any }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobileDropdownOpen, setIsMobileDropdownOpen] = useState(false);
  const [menuAnimationClass, setMenuAnimationClass] = useState("");
  const [menuVisible, setMenuVisible] = useState(false);

  // 处理菜单打开和关闭的动画
  useEffect(() => {
    if (isMenuOpen) {
      setMenuVisible(true);
      setTimeout(() => {
        setMenuAnimationClass("slide-in");
      }, 10);
      document.body.style.overflow = "hidden";
    } else {
      if (menuAnimationClass === "slide-in") {
        setMenuAnimationClass("slide-out");
        setTimeout(() => {
          setMenuVisible(false);
          document.body.style.overflow = "";
          setMenuAnimationClass("");
        }, 300);
      } else {
        setMenuVisible(false);
        document.body.style.overflow = "";
      }
      setIsMobileDropdownOpen(false);
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isMenuOpen, menuAnimationClass]);

  const toggleMobileMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <>
      <style jsx>{`
        @keyframes slideInFromRight {
          0% { transform: translateX(100%); }
          100% { transform: translateX(0); }
        }
        
        @keyframes slideOutToRight {
          0% { transform: translateX(0); }
          100% { transform: translateX(100%); }
        }
        
        .slide-in { animation: slideInFromRight 0.3s forwards; }
        .slide-out { animation: slideOutToRight 0.3s forwards; }
        
        .hamburgerIcon {
          width: 24px;
          height: 20px;
          position: relative;
          display: inline-block;
          cursor: pointer;
        }
        
        .hamburgerIcon span {
          display: block;
          position: absolute;
          height: 3px;
          width: 100%;
          background: #2557a7;
          border-radius: 3px;
          opacity: 1;
          left: 0;
          transform: rotate(0deg);
          transition: .3s ease-in-out;
        }
        
        .hamburgerIcon span:nth-child(1) { top: 0px; }
        .hamburgerIcon span:nth-child(2) { top: 8px; }
        .hamburgerIcon span:nth-child(3) { top: 16px; }
        
        .hamburgerIcon.active span:nth-child(1) {
          top: 8px;
          transform: rotate(45deg);
        }
        
        .hamburgerIcon.active span:nth-child(2) {
          opacity: 0;
          transform: translateX(20px);
        }
        
        .hamburgerIcon.active span:nth-child(3) {
          top: 8px;
          transform: rotate(-45deg);
        }
        
        .mobile-menu-initial { transform: translateX(100%); }
      `}</style>

      {/* 汉堡菜单按钮 */}
      <button
        onClick={toggleMobileMenu}
        aria-label={isMenuOpen ? "關閉選單" : "開啟選單"}
        className="bg-transparent border-0 cursor-pointer p-2.5 z-50"
        style={{
          position: isMenuOpen ? "fixed" : "relative",
          right: isMenuOpen ? "15px" : "auto",
          top: isMenuOpen ? "15px" : "auto",
          width: isMenuOpen ? "44px" : "auto",
          height: isMenuOpen ? "44px" : "auto",
        }}
      >
        <div className={`hamburgerIcon ${isMenuOpen ? "active" : ""}`} style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        }}>
          <span></span>
          <span></span>
          <span></span>
        </div>
      </button>

      {/* 移动版菜单 */}
      {menuVisible && (
        <div
          className={`${menuAnimationClass || "mobile-menu-initial"}`}
          style={{
            display: "block",
            position: "fixed",
            top: 0,
            right: 0,
            width: "100%",
            height: "100vh",
            backgroundColor: "white",
            zIndex: 40,
            overflow: "auto",
            padding: "70px 20px 20px 20px",
            boxShadow: "-5px 0 15px rgba(0, 0, 0, 0.1)"
          }}
        >
          <div>
            <ul className="list-none p-0 m-0">
              {navConfig.mainLinks.map((link: any, index) => (
                <li key={index} className="mb-4 border-b border-gray-200 pb-2.5">
                  <Link
                    href={link.href}
                    onClick={toggleMobileMenu}
                    className="block py-2.5 text-gray-800 no-underline text-lg font-medium"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
              <li className="mt-5">
                {user ? (
                  <div className="text-gray-800 py-2.5">歡迎，{user.displayName}！</div>
                ) : (
                  <form action={handleSignIn}>
                    <Button type="secondary" className="w-full">{navConfig.buttons.login.label}</Button>
                  </form>
                )}
                <Button className="w-full mt-3">{navConfig.buttons.corporate.label}</Button>
              </li>
            </ul>
          </div>
        </div >
      )
      }
    </>
  );
}