// Components
import Button from "@/components/Global/Button";

// Third-Party Library
import Image from "next/image";
import Link from "next/link";

// Lib
import { auth, signIn, signOut } from "@/lib/auth";

// Type
import { User } from "@prisma/client";

export default async function HeaderBar() {
  let session = await auth();
  //@ts-ignore
  const user: User = session.user

  return (
    <>
      <div className="flex flex-row items-center justify-between py-2 px-8 w-full h-16 border ">
        <Link href={"/"} className="logo select-none">
          <Image
            src="/images/logo.png"
            width={200}
            height={200}
            alt="logo"
            className=" translate-y-[0.25rem]"
          />
        </Link>
        <div className="links flex flex-row items-center gap-2">
          <form
            action={async () => {
              "use server";
              await signOut();
            }}
          >
            <button type="submit">歡迎， {user?.displayName!}！</button>
          </form>
          <form
            action={async () => {
              "use server";
              await signIn("google");
            }}
          >
            <Button type="secondary">註冊/登入</Button>
          </form>
          <Button>企業徵才</Button>
        </div>
      </div >
    </>
  );
}
