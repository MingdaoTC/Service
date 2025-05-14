'use server'

import { findManyJob } from "@/library/prisma/job/findMany"
import { findManyCompany } from "@/library/prisma/company/findMany"
 
export async function getJob() {
    return await findManyJob()
}

export async function getCompany() {
    return await findManyCompany()
}