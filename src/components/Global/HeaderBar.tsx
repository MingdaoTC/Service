// Components
import Button from "@/components/Global/Button";

// Third-Party Library
import Image from "next/image";

export default function HeaderBar() {
  return (
    <>
      <div className="flex flex-row items-center justify-between py-2 px-8 w-full h-16 border ">
        <div className="logo">
          <Image
            src="/images/logo.png"
            width={200}
            height={0}
            alt="logo"
            className=" translate-y-[0.25rem]"
          />
        </div>
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
