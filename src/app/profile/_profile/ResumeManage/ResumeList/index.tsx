import ResumeItem from "./ResumeItem";
import { getResumeListByUserEmail } from "../../actions/getResumeList";
import { auth } from "@/library/auth";
import { User } from "@/prisma/client";

export default async function ResumeList() {
  const session = await auth();
  const user = session?.user as User;

  try {
    const resumes = await getResumeListByUserEmail(user?.email || "");
    return (
      <div className="py-4">
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
      <p>No resumes found.</p>
    </div>
  );
}
