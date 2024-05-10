/*
  Warnings:

  - You are about to drop the column `contractId` on the `Contractor` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[registrationId]` on the table `Contractor` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[tin]` on the table `Contractor` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Contractor" DROP COLUMN "contractId";

-- CreateIndex
CREATE UNIQUE INDEX "Contractor_registrationId_key" ON "Contractor"("registrationId");

-- CreateIndex
CREATE UNIQUE INDEX "Contractor_tin_key" ON "Contractor"("tin");
