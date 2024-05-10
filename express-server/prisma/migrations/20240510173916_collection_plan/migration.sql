-- CreateTable
CREATE TABLE "CollectionPlan" (
    "id" SERIAL NOT NULL,
    "contractorId" INTEGER NOT NULL,
    "area" TEXT NOT NULL,
    "startTime" TIMESTAMP(3) NOT NULL,
    "endTime" TIMESTAMP(3) NOT NULL,
    "laborers" INTEGER NOT NULL,
    "vans" INTEGER NOT NULL,
    "expectedWaste" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "CollectionPlan_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "CollectionPlan" ADD CONSTRAINT "CollectionPlan_contractorId_fkey" FOREIGN KEY ("contractorId") REFERENCES "Contractor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
