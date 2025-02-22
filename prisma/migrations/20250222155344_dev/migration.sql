/*
  Warnings:

  - You are about to drop the column `companyId` on the `application` table. All the data in the column will be lost.
  - Added the required column `company.id` to the `application` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "application" DROP COLUMN "companyId",
ADD COLUMN     "company.id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "user" ALTER COLUMN "displayName" DROP NOT NULL,
ALTER COLUMN "phone" DROP NOT NULL,
ALTER COLUMN "description" DROP NOT NULL;
