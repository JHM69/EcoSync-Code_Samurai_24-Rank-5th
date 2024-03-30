-- AlterTable
ALTER TABLE "VehicleEntry" ADD COLUMN     "landfillId" INTEGER NOT NULL DEFAULT 1;

-- AddForeignKey
ALTER TABLE "VehicleEntry" ADD CONSTRAINT "VehicleEntry_landfillId_fkey" FOREIGN KEY ("landfillId") REFERENCES "Landfill"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
