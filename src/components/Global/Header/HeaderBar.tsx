import Button from "@/components/Global/Button/Button";
import SimpleButton from "@/components/Global/Button/SimpleButton";
import UserDropdown from "@/components/Global/Header/UserDropdown";

import Link from "next/link";

import { auth } from "@/library/auth";
import { handleSignIn } from "@/library/auth/auth-actions";

import { User } from "@/prisma/client";
import { navConfig } from "@/config/header";

export default async function HeaderBar() {
  const session = await auth();
  // @ts-ignore
  const user: User = session?.user;

  return (
    <header className="w-full sticky top-0 z-50 bg-white/80 backdrop-blur border-b border-slate-200 shadow-sm z-[2000]">
      <div className="max-w-6xl mx-auto flex items-center justify-between h-14 px-4 sm:px-6 md:px-8">
        <Link href={"/"} className="logo select-none outline-0">
          <img
            src="/images/logo.png"
            width="100%"
            height="100%"
            alt="logo"
            className="w-32 sm:w-40 md:w-48 lg:w-52 translate-y-[0.25rem]"
          />
        </Link>

        <div className="flex items-center gap-3 sm:gap-4">
          <nav className="flex items-center gap-2 sm:gap-3">
            {navConfig.buttons.map((e: any, index: number) => {
              if (e.label === "login") {
                return user ? (
                  <UserDropdown user={user} key={index} />
                ) : (
                  <form action={handleSignIn} key={index}>
                    <SimpleButton
                      type="secondary"
                      className="rounded-lg ring-1 ring-slate-200 bg-white text-slate-700 hover:bg-slate-50 px-3 py-1.5"
                    >
                      {e.text}
                    </SimpleButton>
                  </form>
                );
              } else {
                return (
                  <Button
                    key={index}
                    type={e?.type}
                    href={e.href}
                    className="ml-1 sm:ml-2"
                  >
                    {e.text}
                  </Button>
                );
              }
            })}
          </nav>
        </div>
      </div>
    </header>
  );
}
