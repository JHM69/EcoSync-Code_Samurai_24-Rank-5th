/*
  Warnings:

  - You are about to drop the column `distance` on the `Bill` table. All the data in the column will be lost.
  - You are about to drop the column `duration` on the `Bill` table. All the data in the column will be lost.
  - You are about to drop the column `vehicleEntryId` on the `Bill` table. All the data in the column will be lost.
  - You are about to drop the column `vehicleId` on the `TruckDumpEntry` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[tripId]` on the table `Bill` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `tripId` to the `Bill` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tripId` to the `TruckDumpEntry` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tripId` to the `VehicleEntry` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Bill" DROP CONSTRAINT "Bill_vehicleEntryId_fkey";

-- DropForeignKey
ALTER TABLE "TruckDumpEntry" DROP CONSTRAINT "TruckDumpEntry_vehicleId_fkey";

-- DropIndex
DROP INDEX "Bill_vehicleEntryId_key";

-- DropIndex
DROP INDEX "idx_bills_vehicle_entry";

-- DropIndex
DROP INDEX "idx_truck_dump_entry_vehicle";

-- AlterTable
ALTER TABLE "Bill" DROP COLUMN "distance",
DROP COLUMN "duration",
DROP COLUMN "vehicleEntryId",
ADD COLUMN     "tripId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "TruckDumpEntry" DROP COLUMN "vehicleId",
ADD COLUMN     "tripId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "VehicleEntry" ADD COLUMN     "tripId" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "VehicleMeta" (
    "id" SERIAL NOT NULL,
    "tripId" INTEGER NOT NULL,
    "lat" DOUBLE PRECISION NOT NULL,
    "lon" DOUBLE PRECISION NOT NULL,
    "weight" DOUBLE PRECISION NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "VehicleMeta_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Trip" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "vehicleId" INTEGER NOT NULL,
    "driverId" INTEGER NOT NULL,
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "distance" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "duration" DOUBLE PRECISION NOT NULL DEFAULT 0,

    CONSTRAINT "Trip_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Bill_tripId_key" ON "Bill"("tripId");

-- AddForeignKey
ALTER TABLE "VehicleEntry" ADD CONSTRAINT "VehicleEntry_tripId_fkey" FOREIGN KEY ("tripId") REFERENCES "Trip"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Bill" ADD CONSTRAINT "Bill_tripId_fkey" FOREIGN KEY ("tripId") REFERENCES "Trip"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TruckDumpEntry" ADD CONSTRAINT "TruckDumpEntry_tripId_fkey" FOREIGN KEY ("tripId") REFERENCES "Trip"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VehicleMeta" ADD CONSTRAINT "VehicleMeta_tripId_fkey" FOREIGN KEY ("tripId") REFERENCES "Trip"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Trip" ADD CONSTRAINT "Trip_vehicleId_fkey" FOREIGN KEY ("vehicleId") REFERENCES "Vehicle"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Trip" ADD CONSTRAINT "Trip_driverId_fkey" FOREIGN KEY ("driverId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
