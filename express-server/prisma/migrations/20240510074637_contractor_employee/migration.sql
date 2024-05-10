-- AlterEnum
ALTER TYPE "RoleType" ADD VALUE 'ContractorManager';

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "accessLevel" TEXT;

-- AlterTable
ALTER TABLE "WasteEntry" ADD COLUMN     "contractorId" INTEGER,
ADD COLUMN     "vehicleType" TEXT NOT NULL DEFAULT 'Van',
ADD COLUMN     "wasteType" TEXT NOT NULL DEFAULT 'Domestic';

-- CreateTable
CREATE TABLE "Contractor" (
    "id" SERIAL NOT NULL,
    "companyName" TEXT NOT NULL,
    "contractId" TEXT NOT NULL,
    "registrationId" TEXT NOT NULL,
    "registrationDate" TIMESTAMP(3) NOT NULL,
    "tin" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "paymentPerTonnage" DOUBLE PRECISION NOT NULL,
    "requiredWastePerDay" DOUBLE PRECISION NOT NULL,
    "contractStartDate" TIMESTAMP(3) NOT NULL,
    "contractEndDate" TIMESTAMP(3) NOT NULL,
    "areaOfCollection" TEXT NOT NULL,
    "stsId" INTEGER NOT NULL,

    CONSTRAINT "Contractor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Employee" (
    "id" SERIAL NOT NULL,
    "contractorId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "dateOfBirth" TIMESTAMP(3) NOT NULL,
    "dateOfHire" TIMESTAMP(3) NOT NULL,
    "jobTitle" TEXT NOT NULL,
    "paymentRatePerHour" DOUBLE PRECISION NOT NULL,
    "phone" TEXT NOT NULL,
    "assignedCollectionRoute" TEXT NOT NULL,

    CONSTRAINT "Employee_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_ContractorToUser" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_ContractorToUser_AB_unique" ON "_ContractorToUser"("A", "B");

-- CreateIndex
CREATE INDEX "_ContractorToUser_B_index" ON "_ContractorToUser"("B");

-- AddForeignKey
ALTER TABLE "WasteEntry" ADD CONSTRAINT "WasteEntry_contractorId_fkey" FOREIGN KEY ("contractorId") REFERENCES "Contractor"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Contractor" ADD CONSTRAINT "Contractor_stsId_fkey" FOREIGN KEY ("stsId") REFERENCES "STS"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Employee" ADD CONSTRAINT "Employee_contractorId_fkey" FOREIGN KEY ("contractorId") REFERENCES "Contractor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ContractorToUser" ADD CONSTRAINT "_ContractorToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "Contractor"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ContractorToUser" ADD CONSTRAINT "_ContractorToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
