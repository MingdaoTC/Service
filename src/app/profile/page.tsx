import { auth } from "@/lib/auth/auth";
import { User } from "@/prisma/client";

import BasicInfo from "./_profile/BasicInfo";

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

  return (
    <div>
      <BasicInfo user={user} />
    </div>
  );
}
