import { getApplicationList } from "@/library/actions/getApplicationList";
import { getResumeListByUserEmail } from "@/library/actions/getResumeList";
import ExpandableRow from "./_application/ExpandableRow";

export default async function ApplicationListPage() {
  const applications = await getApplicationList();

  // 取得所有應徵者的履歷資訊
  const resumeMap: Record<string, any> = {};
  for (const app of applications) {
    if (app.email && !resumeMap[app.email]) {
      const resumes = await getResumeListByUserEmail(app.email);
      if (resumes && resumes.length > 0) {
        resumeMap[app.email] = resumes[0];
      }
    }
  }

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-6 bg-white shadow-sm rounded-lg border p-4 flex justify-between items-center">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold text-blue-800">
            應徵者列表
          </h1>
          <p className="text-gray-600 mt-1">查看應徵者檔案</p>
        </div>
      </div>
      <div className="bg-white shadow-sm rounded-lg border overflow-hidden mb-8 text-center">
        <div className="p-4 bg-gray-50 border-b text-center">
          <div className="grid grid-cols-6 text-sm font-medium text-gray-600">
            <div className="col-span-2">應徵者 Email</div>
            <div className="col-span-1">姓名</div>
            <div className="col-span-1">狀態</div>
            <div className="col-span-1">應徵時間</div>
            <div className="col-span-1">操作</div>
          </div>
        </div>
        <div className="divide-y">
          {applications.length === 0 && (
            <div className="px-4 py-6 text-center text-gray-500">
              無應徵資料
            </div>
          )}
          {applications.map((app: any) => (
            <ExpandableRow
              key={app.id}
              app={app}
              resume={resumeMap[app.email]}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
