/*
  Warnings:

  - You are about to drop the column `vehicleNumber` on the `Vehicle` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[registrationNumber]` on the table `Vehicle` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `registrationNumber` to the `Vehicle` table without a default value. This is not possible if the table is not empty.
  - Added the required column `remainingCapacity` to the `Vehicle` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Vehicle_vehicleNumber_key";

-- AlterTable
ALTER TABLE "Vehicle" DROP COLUMN "vehicleNumber",
ADD COLUMN     "registrationNumber" TEXT NOT NULL,
ADD COLUMN     "remainingCapacity" INTEGER NOT NULL,
ALTER COLUMN "lat" SET DEFAULT 0,
ALTER COLUMN "lon" SET DEFAULT 0,
ALTER COLUMN "isFull" SET DEFAULT false;

-- CreateIndex
CREATE UNIQUE INDEX "Vehicle_registrationNumber_key" ON "Vehicle"("registrationNumber");
