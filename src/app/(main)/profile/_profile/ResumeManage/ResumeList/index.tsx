import { auth } from "@/library/auth";
import { User } from "@/prisma/client";
import { getResumeListByUserEmail } from "@/library/actions/getResumeList";
import ResumeItem from "./ResumeItem";

export default async function ResumeList() {
  const session = await auth();
  const user = session?.user as User;

  try {
    const resumes = await getResumeListByUserEmail(user?.email || "");

    if (resumes.length === 0) {
      return (
        <div className="py-4">
          <p className="text-center">您還沒有任何履歷，馬上建立履歷吧</p>
        </div>
      );
    }

    return (
      <div className="py-4 flex flex-col gap-3">
        {resumes.map((resume) => {
          return (
            <ResumeItem
              key={resume.id}
              resumeName={resume.name}
              resumeKey={resume.objectKey}
            />
          );
        })}
      </div>
    );
  } catch (error) {
    console.error("Error fetching resumes:", error);
  }

  return (
    <div className="py-4">
      <p className="text-center">您還沒有任何履歷，馬上建立履歷吧</p>
    </div>
  );
}
