/*
  Warnings:

  - Added the required column `currentVolume` to the `Vehicle` table without a default value. This is not possible if the table is not empty.
  - Added the required column `isFull` to the `Vehicle` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lat` to the `Vehicle` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lon` to the `Vehicle` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "TruckDumpEntry" ALTER COLUMN "volumeOfWaste" SET DATA TYPE DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "Vehicle" ADD COLUMN     "currentVolume" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "isFull" BOOLEAN NOT NULL,
ADD COLUMN     "lat" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "lon" DOUBLE PRECISION NOT NULL;
