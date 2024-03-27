/*
  Warnings:

  - Added the required column `currentWasteVolume` to the `Landfill` table without a default value. This is not possible if the table is not empty.
  - Added the required column `endTime` to the `Landfill` table without a default value. This is not possible if the table is not empty.
  - Added the required column `startTime` to the `Landfill` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Landfill" ADD COLUMN     "currentWasteVolume" INTEGER NOT NULL,
ADD COLUMN     "endTime" TEXT NOT NULL,
ADD COLUMN     "startTime" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Vehicle" ADD COLUMN     "stsId" INTEGER;

-- AddForeignKey
ALTER TABLE "Vehicle" ADD CONSTRAINT "Vehicle_stsId_fkey" FOREIGN KEY ("stsId") REFERENCES "STS"("id") ON DELETE SET NULL ON UPDATE CASCADE;
