import { prisma } from "@/lib/db/prisma";

export async function findManyRegistration() {
    const companyRegistration = await prisma.companyRegistration.findMany();
    const alumniRegistration = await prisma.alumniRegistration.findMany();
    return {
        companyRegistration,
        alumniRegistration,
    };
}
