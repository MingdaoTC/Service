"use server";

import { findManyApplication } from "@/library/prisma/application/findMany";

export async function getApplicationList() {
  try {
    const applications = await findManyApplication();
    return applications;
  } catch (error) {
    console.error("Error fetching applications:", error);
    throw new Error("Failed to fetch applications");
  }
}
