/*
  Warnings:

  - A unique constraint covering the columns `[phone]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterEnum
ALTER TYPE "RoleType" ADD VALUE 'Driver';

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "drivingLicense" TEXT,
ADD COLUMN     "phone" TEXT;

-- CreateTable
CREATE TABLE "_UserToVehicle" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_UserToVehicle_AB_unique" ON "_UserToVehicle"("A", "B");

-- CreateIndex
CREATE INDEX "_UserToVehicle_B_index" ON "_UserToVehicle"("B");

-- CreateIndex
CREATE UNIQUE INDEX "User_phone_key" ON "User"("phone");

-- AddForeignKey
ALTER TABLE "_UserToVehicle" ADD CONSTRAINT "_UserToVehicle_A_fkey" FOREIGN KEY ("A") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserToVehicle" ADD CONSTRAINT "_UserToVehicle_B_fkey" FOREIGN KEY ("B") REFERENCES "Vehicle"("id") ON DELETE CASCADE ON UPDATE CASCADE;
