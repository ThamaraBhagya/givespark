/*
  Warnings:

  - A unique constraint covering the columns `[stripePaymentIntentId]` on the table `Donation` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Donation" ADD COLUMN     "stripePaymentIntentId" TEXT;

-- AlterTable
ALTER TABLE "WalletTransaction" ADD COLUMN     "sourceId" TEXT,
ADD COLUMN     "sourceType" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Donation_stripePaymentIntentId_key" ON "Donation"("stripePaymentIntentId");
