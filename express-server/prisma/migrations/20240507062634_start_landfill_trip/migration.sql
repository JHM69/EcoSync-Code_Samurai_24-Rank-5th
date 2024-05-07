/*
  Warnings:

  - Added the required column `startLandfillId` to the `Trip` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Trip" ADD COLUMN     "startLandfillId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Trip" ADD CONSTRAINT "Trip_startLandfillId_fkey" FOREIGN KEY ("startLandfillId") REFERENCES "Landfill"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
