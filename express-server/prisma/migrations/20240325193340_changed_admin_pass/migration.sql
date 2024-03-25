/*
  Warnings:

  - You are about to drop the column `currentVolume` on the `Vehicle` table. All the data in the column will be lost.
  - Added the required column `loaddedFuelCost` to the `Vehicle` table without a default value. This is not possible if the table is not empty.
  - Added the required column `unloadedFuelCost` to the `Vehicle` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "changedAdminPassword" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Vehicle" DROP COLUMN "currentVolume",
ADD COLUMN     "loaddedFuelCost" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "unloadedFuelCost" DOUBLE PRECISION NOT NULL;

-- CreateIndex
CREATE INDEX "idx_user_role" ON "User"("roleId");
