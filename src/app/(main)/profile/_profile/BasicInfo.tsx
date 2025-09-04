import { User } from "@/prisma/client";

export default function BasicInfo({ user }: { user: User }) {
  return (
    <div className="flex items-center justify-start gap-4 md:gap-6 w-full max-w-6xl mx-auto mt-2 px-4 md:px-6 py-4 bg-white/95 backdrop-blur rounded-2xl ring-1 ring-slate-200 shadow-md">
      <img
        src={user.avatarUrl.split("=s96")[0] || "/default-avatar.png"}
        alt="User Avatar"
        className="w-20 h-20 md:w-24 md:h-24 rounded-full ring-2 ring-white shadow"
      />
      <div className="flex flex-col gap-2 md:gap-3 px-2 cursor-default">
        <p className="text-3xl font-extrabold text-slate-800 max-md:hidden">
          早安，{user.displayName}
        </p>
        <p className="text-2xl font-extrabold text-slate-800 hidden max-md:block">
          {user.displayName}
        </p>
        <p className="text-xs md:text-sm text-mingdao-blue-dark font-medium bg-mingdao-blue-light rounded-full px-3 md:px-4 py-1">
          @{user.username}
        </p>
      </div>
    </div>
  );
}
