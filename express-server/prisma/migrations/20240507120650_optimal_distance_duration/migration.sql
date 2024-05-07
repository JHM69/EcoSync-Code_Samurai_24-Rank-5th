/*
  Warnings:

  - You are about to drop the column `landfillId` on the `VehicleEntry` table. All the data in the column will be lost.
  - You are about to drop the column `vehicleId` on the `VehicleEntry` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "VehicleEntry" DROP CONSTRAINT "VehicleEntry_landfillId_fkey";

-- DropForeignKey
ALTER TABLE "VehicleEntry" DROP CONSTRAINT "VehicleEntry_vehicleId_fkey";

-- DropIndex
DROP INDEX "idx_vehicle_entry_vehicle";

-- AlterTable
ALTER TABLE "Bill" ADD COLUMN     "optimalAmount" DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "Trip" ADD COLUMN     "optimalDistance" DOUBLE PRECISION,
ADD COLUMN     "optimalDuration" DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "Vehicle" ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'Active';

-- AlterTable
ALTER TABLE "VehicleEntry" DROP COLUMN "landfillId",
DROP COLUMN "vehicleId";
