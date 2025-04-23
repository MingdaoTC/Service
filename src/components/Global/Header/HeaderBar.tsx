// Components
import SimpleButton from "@/components/Global/Button/SimpleButton";
import Button from "@/components/Global/Button/Button";
import UserDropdown from "@/components/Global/Header/UserDropdown";

// Third-Party Library
import Image from "next/image";
import Link from "next/link";

// Lib
import { auth } from "@/lib/auth/auth";
import { handleSignIn } from "@/lib/auth/auth-actions";

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
      <div className="flex flex-row items-center justify-between py-2 px-4 sm:px-6 md:px-8 w-full h-12 border-b">
        <Link href={"/"} className="logo select-none outline-0 ">
          <img
            src="/images/logo.png"
            width="100%"
            height="100%"
            alt="logo"
            className="w-32 sm:w-40 md:w-48 lg:w-52 translate-y-[0.25rem]"
          />
        </Link>

        <div className="flex flex-row items-center gap-6">
          <nav className="flex items-center space-x-5">
            {navConfig.buttons.map((e: any, index) => {
              if (e.label === "login") {
                return (
                  user ? (
                    <UserDropdown user={user} key={index} />
                  ) : (
                    <form action={handleSignIn}>
                      <SimpleButton type="secondary" key={index}>{e.text}</SimpleButton>
                    </form>
                  )
                );
              } else {
                return (
                  <Button
                    key={index}
                    type={e?.type}
                    href={e.href}
                    className="flex items-center gap-3 ml-4"
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