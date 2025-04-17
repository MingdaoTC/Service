// Components
import Button from "@/components/Global/Button";
import MobileMenu from "@/components/Global/MobileMenu";

// Third-Party Library
import Image from "next/image";
import Link from "next/link";

// Lib
import { auth } from "@/lib/auth";
import { handleSignIn, handleSignOut } from "@/lib/auth-actions";

// Type
import { User } from "@/prisma/client";

// Config
import { navConfig } from "@/config/header";

export default async function HeaderBar() {
  let session = await auth();
  //@ts-ignore
  const user: User = session?.user;

  return (
    <header className="w-full shadow-sm">
      <div className="flex flex-row items-center justify-between py-2 px-4 sm:px-6 md:px-8 w-full h-16 border-b">
        <Link href={"/"} className="logo select-none">
          <Image
            src="/images/logo.png"
            width={200}
            height={200}
            alt="logo"
            className="w-32 sm:w-40 md:w-48 lg:w-52 translate-y-[0.25rem]"
          />
        </Link>

        {/* 桌面版菜单 - 大屏幕显示 */}
        <div className="hidden md:flex flex-row items-center gap-6">
          <nav className="flex items-center space-x-5">
            {navConfig.mainLinks.map((link: any, index) => (
              <Link
                key={index}
                href={link.href}
                className="text-blue-800 hover:text-blue-600 transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3 ml-4">
            {user ? (
              <form action={handleSignOut}>
                <button type="submit" className="text-blue-800">歡迎，{user?.displayName!}！</button>
              </form>
            ) : (
              <form action={handleSignIn}>
                <Button type="secondary">{navConfig.buttons.login.label}</Button>
              </form>
            )}
            <Button>{navConfig.buttons.corporate.label}</Button>
          </div>
        </div>

        {/* 汉堡菜单按钮 - 小屏幕显示 */}
        <div className="md:hidden">
          <MobileMenu user={user} />
        </div>
      </div>
    </header>
  );
}