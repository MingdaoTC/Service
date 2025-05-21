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
      <div className="w-full h-screen flex flex-col items-center justify-center">
        <p className="text-lg text-gray-500">
          Please log in to view your profile.
        </p>
        <a
          href="/api/auth/signin"
          className="mt-4 px-4 py-2 bg-mingdao-blue text-white rounded border-mingdao-blue border  hover:bg-transparent hover:text-mingdao-blue transition duration-300 ease-in-out"
        >
          Log In
        </a>
      </div>
    );
  }

  const userProfile = await getProfile(user.email);

  return (
    <div>
      <BasicInfo user={user} />
      <div className="w-[90dvw] max-w-[1440px] mx-auto py-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-transparent rounded-lg">
          {!userProfile.profileExists && !userProfile.error ? (
            <UpdateForm mode="create" />
          ) : (
            <UpdateForm
              initialData={userProfile.profile as UserProfile}
              mode="update"
            />
          )}
        </div>
        <div className="">
          <ResumeManage />
        </div>
      </div>
    </div>
  );
}
