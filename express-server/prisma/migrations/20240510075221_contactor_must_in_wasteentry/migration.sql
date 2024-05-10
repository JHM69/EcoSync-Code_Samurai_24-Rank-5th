/*
  Warnings:

  - Made the column `contractorId` on table `WasteEntry` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "WasteEntry" DROP CONSTRAINT "WasteEntry_contractorId_fkey";

-- AlterTable
ALTER TABLE "WasteEntry" ALTER COLUMN "contractorId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "WasteEntry" ADD CONSTRAINT "WasteEntry_contractorId_fkey" FOREIGN KEY ("contractorId") REFERENCES "Contractor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
