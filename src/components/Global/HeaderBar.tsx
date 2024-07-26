import Button from "./Button";

export default function HeaderBar() {
  return (
    <>
      <div className="flex flex-row items-center justify-between py-2 px-8 w-full h-16 border ">
        <div className="logo">
          <div className="bg-slate-500 h-8 w-20"></div>
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
