// Components
import Button from "@/components/Global/Button";

// Third-Party Library
import Image from "next/image";
import Link from "next/link";

export default function HeaderBar() {
  return (
    <>
      <div className="flex flex-row items-center justify-between py-2 px-8 w-full h-16 border ">
        <Link href={"/"} className="logo select-none">
          <Image
            src="/images/logo.png"
            width={200}
            height={0}
            alt="logo"
            className=" translate-y-[0.25rem]"
          />
        </Link>
        <div className="links flex flex-row items-center gap-2">
          <Button type="secondary" href="/login">
            Sign In
          </Button>
          <Button href="/signup">Enterprise Sign Up</Button>
        </div>
      </div>
    </>
  );
}
