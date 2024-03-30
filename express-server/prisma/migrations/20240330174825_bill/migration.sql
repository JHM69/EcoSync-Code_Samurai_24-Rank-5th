-- CreateTable
CREATE TABLE "Bill" (
    "id" SERIAL NOT NULL,
    "vehicleEntryId" INTEGER NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "paid" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "distance" DOUBLE PRECISION NOT NULL,
    "duration" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "Bill_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Bill_vehicleEntryId_key" ON "Bill"("vehicleEntryId");

-- CreateIndex
CREATE INDEX "idx_bills_vehicle_entry" ON "Bill"("vehicleEntryId");

-- AddForeignKey
ALTER TABLE "Bill" ADD CONSTRAINT "Bill_vehicleEntryId_fkey" FOREIGN KEY ("vehicleEntryId") REFERENCES "VehicleEntry"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
