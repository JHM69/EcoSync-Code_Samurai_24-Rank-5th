/*
  Warnings:

  - You are about to drop the column `tripId` on the `TripPlan` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[tripPlanId]` on the table `Trip` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `tripPlanId` to the `Trip` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "TripPlan" DROP CONSTRAINT "TripPlan_tripId_fkey";

-- DropIndex
DROP INDEX "TripPlan_tripId_key";

-- AlterTable
ALTER TABLE "Trip" ADD COLUMN     "tripPlanId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "TripPlan" DROP COLUMN "tripId";

-- AlterTable
ALTER TABLE "TripPlanLandfill" ADD COLUMN     "weiqht" DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "TripPlanSts" ADD COLUMN     "weiqht" DOUBLE PRECISION;

-- CreateIndex
CREATE UNIQUE INDEX "Trip_tripPlanId_key" ON "Trip"("tripPlanId");

-- AddForeignKey
ALTER TABLE "Trip" ADD CONSTRAINT "Trip_tripPlanId_fkey" FOREIGN KEY ("tripPlanId") REFERENCES "TripPlan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
