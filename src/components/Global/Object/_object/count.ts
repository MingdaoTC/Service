"use server";

import { countJob } from "@/library/prisma/job/count";

export async function countJobs(param: { companyId: string }) {
  return await countJob({
    companyId: param.companyId,
  });
}
