import { auth } from "@/library/auth";
import { User, UserProfile } from "@/prisma/client";

import BasicInfo from "./_profile/BasicInfo";
import ResumeManage from "./_profile/ResumeManage";
import UpdateForm from "./_profile/UpdateForm";
import { getProfile } from "./_profile/actions/getProfile";

export default async function Profile() {
  const session = await auth();
  // @ts-ignore
  const user: User | null = session?.user || null;

  if (!user) {
    return (
      <div className="min-h-[100dvh] flex items-center justify-center bg-gradient-to-b from-blue-50 via-white to-teal-50 px-4">
        <div className="w-full max-w-md bg-white/95 backdrop-blur rounded-2xl ring-1 ring-slate-200 shadow-md p-6 text-center">
          <p className="text-base md:text-lg text-slate-600">
            Please log in to view your profile.
          </p>
          <a
            href="/api/auth/signin"
            className="mt-4 inline-flex items-center justify-center px-4 py-2 rounded-xl font-semibold text-white bg-gradient-to-r from-blue-600 to-teal-500 hover:opacity-90 shadow-sm ring-1 ring-slate-200 transition"
          >
            Log In
          </a>
        </div>
      </div>
    );
  }

  const userProfile = await getProfile(user.email);

  return (
    <div className="min-h-[calc(100vh-6rem)] bg-gradient-to-b from-blue-50 via-white to-blue-50">
      <div className="w-full max-w-6xl mx-auto px-4">
        {/* 頁首基本資訊卡片（沿用原元件樣式） */}
        <div className="pt-4 md:pt-6">
          <BasicInfo user={user} />
        </div>

        {/* 主要內容區塊 */}
        <div className="py-4 md:py-6 grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
          <div className="bg-white rounded-2xl ring-1 ring-slate-200 shadow-md p-3 sm:p-4">
            {!userProfile.profileExists && !userProfile.error ? (
              <UpdateForm mode="create" />
            ) : (
              <UpdateForm
                initialData={userProfile.profile as UserProfile}
                mode="update"
              />
            )}
          </div>

          <div className="bg-white rounded-2xl ring-1 ring-slate-200 shadow-md p-3 sm:p-4">
            <ResumeManage />
          </div>
        </div>
      </div>
    </div>
  );
}
