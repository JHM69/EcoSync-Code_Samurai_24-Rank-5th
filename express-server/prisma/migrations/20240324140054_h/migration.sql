/*
  Warnings:

  - You are about to alter the column `capacity` on the `Vehicle` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Integer`.
  - Added the required column `currentWasteVolume` to the `STS` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "STS" ADD COLUMN     "currentWasteVolume" DOUBLE PRECISION NOT NULL,
ALTER COLUMN "wardNumber" SET DATA TYPE TEXT,
ALTER COLUMN "capacity" SET DATA TYPE DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "Vehicle" ALTER COLUMN "capacity" SET DATA TYPE INTEGER;

-- AlterTable
ALTER TABLE "VehicleEntry" ALTER COLUMN "volumeOfWaste" SET DATA TYPE DOUBLE PRECISION;
