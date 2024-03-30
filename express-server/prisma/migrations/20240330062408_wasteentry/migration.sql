-- CreateTable
CREATE TABLE "WasteEntry" (
    "id" SERIAL NOT NULL,
    "stsId" INTEGER NOT NULL,
    "volumeOfWaste" DOUBLE PRECISION NOT NULL,
    "timeOfArrival" TIMESTAMP(3) NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "WasteEntry_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "idx_waste_entry_sts" ON "WasteEntry"("stsId");

-- CreateIndex
CREATE INDEX "idx_waste_entry_user" ON "WasteEntry"("userId");

-- CreateIndex
CREATE INDEX "idx_waste_entry_time_of_arrival" ON "WasteEntry"("timeOfArrival");

-- AddForeignKey
ALTER TABLE "WasteEntry" ADD CONSTRAINT "WasteEntry_stsId_fkey" FOREIGN KEY ("stsId") REFERENCES "STS"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WasteEntry" ADD CONSTRAINT "WasteEntry_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
