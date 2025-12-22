/*
  Warnings:

  - The `category` column on the `Campaign` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "Category" AS ENUM ('EDUCATION', 'MEDICAL', 'TECHNOLOGY', 'COMMUNITY', 'OTHER');

-- AlterTable
ALTER TABLE "Campaign" DROP COLUMN "category",
ADD COLUMN     "category" "Category" NOT NULL DEFAULT 'OTHER';
