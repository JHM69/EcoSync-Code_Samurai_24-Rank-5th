-- AlterTable
ALTER TABLE "User" ADD COLUMN     "deviceId" TEXT;

-- CreateTable
CREATE TABLE "TripPlan" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "type" TEXT NOT NULL DEFAULT 'human',
    "driverId" INTEGER NOT NULL,
    "vehicleId" INTEGER NOT NULL,
    "tripId" INTEGER,

    CONSTRAINT "TripPlan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TripPlanSts" (
    "id" SERIAL NOT NULL,
    "tripPlanId" INTEGER NOT NULL,
    "stsId" INTEGER NOT NULL,
    "time" TIMESTAMP(3) NOT NULL,
    "visited" BOOLEAN NOT NULL DEFAULT false,
    "visitedAt" TIMESTAMP(3),

    CONSTRAINT "TripPlanSts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TripPlanLandfill" (
    "id" SERIAL NOT NULL,
    "tripPlanId" INTEGER NOT NULL,
    "landfillId" INTEGER NOT NULL,
    "time" TIMESTAMP(3) NOT NULL,
    "visited" BOOLEAN NOT NULL DEFAULT false,
    "visitedAt" TIMESTAMP(3),

    CONSTRAINT "TripPlanLandfill_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "TripPlan_tripId_key" ON "TripPlan"("tripId");

-- AddForeignKey
ALTER TABLE "TripPlan" ADD CONSTRAINT "TripPlan_driverId_fkey" FOREIGN KEY ("driverId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TripPlan" ADD CONSTRAINT "TripPlan_vehicleId_fkey" FOREIGN KEY ("vehicleId") REFERENCES "Vehicle"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TripPlan" ADD CONSTRAINT "TripPlan_tripId_fkey" FOREIGN KEY ("tripId") REFERENCES "Trip"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TripPlanSts" ADD CONSTRAINT "TripPlanSts_tripPlanId_fkey" FOREIGN KEY ("tripPlanId") REFERENCES "TripPlan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TripPlanSts" ADD CONSTRAINT "TripPlanSts_stsId_fkey" FOREIGN KEY ("stsId") REFERENCES "STS"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TripPlanLandfill" ADD CONSTRAINT "TripPlanLandfill_tripPlanId_fkey" FOREIGN KEY ("tripPlanId") REFERENCES "TripPlan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TripPlanLandfill" ADD CONSTRAINT "TripPlanLandfill_landfillId_fkey" FOREIGN KEY ("landfillId") REFERENCES "Landfill"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
