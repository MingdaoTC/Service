import { User } from "@/prisma/client";

export default function BasicInfo({ user }: { user: User }) {
  return (
    <div className="flex gap-3 items-center justify-start px-6 py-4 w-[90dvw] max-w-[1440px]  bg-white rounded-lg border border-mingdao-blue mx-auto mt-10 max-lg:px-3 max-lg:gap-2">
      <img
        src={user.avatarUrl.split("=s96")[0] || "/default-avatar.png"}
        alt="User Avatar"
        className="w-24 h-24 rounded-full max-lg:w-20 max-lg:h-20"
      />
      <div className="flex flex-col gap-3 items-start justify-around px-4 cursor-default">
        <p className="text-3xl max-md:hidden">
          早安，{user.displayName}
        </p>
        <p className="text-2xl hidden max-md:block">{user.displayName}</p>
        <p className="text-sm text-mingdao-blue-dark font-thin bg-mingdao-blue-light rounded-full px-4 pt-1 pb-2 max-lg:text-xs max-lg:px-2">
          @{user.username}
        </p>
      </div>
    </div>
  );
}
