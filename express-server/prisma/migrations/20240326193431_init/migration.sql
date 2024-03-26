-- CreateEnum
CREATE TYPE "VehicleType" AS ENUM ('OpenTruck', 'DumpTruck', 'Compactor', 'ContainerCarrier');

-- CreateEnum
CREATE TYPE "RoleType" AS ENUM ('SystemAdmin', 'STSManager', 'LandfillManager', 'Unassigned');

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "image" TEXT DEFAULT 'https://static.productionready.io/images/smiley-cyrus.jpg',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastLogin" TIMESTAMP(3),
    "lastLogout" TIMESTAMP(3),
    "roleId" INTEGER NOT NULL DEFAULT 4,
    "changedAdminPassword" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PasswordResetToken" (
    "id" SERIAL NOT NULL,
    "token" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "expiration" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PasswordResetToken_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Role" (
    "id" SERIAL NOT NULL,
    "type" "RoleType" NOT NULL DEFAULT 'Unassigned',

    CONSTRAINT "Role_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Permission" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Permission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Vehicle" (
    "id" SERIAL NOT NULL,
    "vehicleNumber" TEXT NOT NULL,
    "type" "VehicleType" NOT NULL,
    "capacity" INTEGER NOT NULL,
    "lat" DOUBLE PRECISION NOT NULL,
    "lon" DOUBLE PRECISION NOT NULL,
    "isFull" BOOLEAN NOT NULL,
    "loaddedFuelCost" DOUBLE PRECISION NOT NULL,
    "unloadedFuelCost" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "Vehicle_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "STS" (
    "id" SERIAL NOT NULL,
    "wardNumber" TEXT NOT NULL,
    "capacity" DOUBLE PRECISION NOT NULL,
    "currentWasteVolume" DOUBLE PRECISION NOT NULL,
    "lat" DOUBLE PRECISION NOT NULL,
    "lon" DOUBLE PRECISION NOT NULL,
    "managerId" INTEGER,

    CONSTRAINT "STS_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VehicleEntry" (
    "id" SERIAL NOT NULL,
    "stsId" INTEGER NOT NULL,
    "vehicleId" INTEGER NOT NULL,
    "volumeOfWaste" DOUBLE PRECISION NOT NULL,
    "timeOfArrival" TIMESTAMP(3) NOT NULL,
    "timeOfDeparture" TIMESTAMP(3) NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "VehicleEntry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TruckDumpEntry" (
    "id" SERIAL NOT NULL,
    "vehicleId" INTEGER NOT NULL,
    "volumeOfWaste" DOUBLE PRECISION NOT NULL,
    "timeOfArrival" TIMESTAMP(3) NOT NULL,
    "timeOfDeparture" TIMESTAMP(3) NOT NULL,
    "landfillId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "TruckDumpEntry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Landfill" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "capacity" INTEGER NOT NULL,
    "gpsCoords" TEXT NOT NULL,
    "managerId" INTEGER,
    "lat" DOUBLE PRECISION NOT NULL,
    "lon" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "Landfill_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_PermissionToRole" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_LandfillToUser" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "idx_user_role" ON "User"("roleId");

-- CreateIndex
CREATE INDEX "idx_user_name" ON "User"("name");

-- CreateIndex
CREATE INDEX "idx_user_email" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "PasswordResetToken_token_key" ON "PasswordResetToken"("token");

-- CreateIndex
CREATE UNIQUE INDEX "PasswordResetToken_userId_key" ON "PasswordResetToken"("userId");

-- CreateIndex
CREATE INDEX "idx_password_reset_token_user" ON "PasswordResetToken"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Role_type_key" ON "Role"("type");

-- CreateIndex
CREATE UNIQUE INDEX "Permission_name_key" ON "Permission"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Vehicle_vehicleNumber_key" ON "Vehicle"("vehicleNumber");

-- CreateIndex
CREATE INDEX "idx_vehicle_type" ON "Vehicle"("type");

-- CreateIndex
CREATE INDEX "idx_vehicle_capacity" ON "Vehicle"("capacity");

-- CreateIndex
CREATE INDEX "idx_vehicle_loadded_fuel_cost" ON "Vehicle"("loaddedFuelCost");

-- CreateIndex
CREATE UNIQUE INDEX "STS_managerId_key" ON "STS"("managerId");

-- CreateIndex
CREATE INDEX "idx_sts_manager" ON "STS"("managerId");

-- CreateIndex
CREATE INDEX "idx_sts_ward_number" ON "STS"("wardNumber");

-- CreateIndex
CREATE INDEX "idx_sts_capacity" ON "STS"("capacity");

-- CreateIndex
CREATE INDEX "idx_vehicle_entry_sts" ON "VehicleEntry"("stsId");

-- CreateIndex
CREATE INDEX "idx_vehicle_entry_vehicle" ON "VehicleEntry"("vehicleId");

-- CreateIndex
CREATE INDEX "idx_vehicle_entry_user" ON "VehicleEntry"("userId");

-- CreateIndex
CREATE INDEX "idx_vehicle_entry_time_of_arrival" ON "VehicleEntry"("timeOfArrival");

-- CreateIndex
CREATE INDEX "idx_vehicle_entry_time_of_departure" ON "VehicleEntry"("timeOfDeparture");

-- CreateIndex
CREATE INDEX "idx_truck_dump_entry_vehicle" ON "TruckDumpEntry"("vehicleId");

-- CreateIndex
CREATE INDEX "idx_truck_dump_entry_landfill" ON "TruckDumpEntry"("landfillId");

-- CreateIndex
CREATE INDEX "idx_truck_dump_entry_user" ON "TruckDumpEntry"("userId");

-- CreateIndex
CREATE INDEX "idx_truck_dump_entry_time_of_arrival" ON "TruckDumpEntry"("timeOfArrival");

-- CreateIndex
CREATE INDEX "idx_truck_dump_entry_time_of_departure" ON "TruckDumpEntry"("timeOfDeparture");

-- CreateIndex
CREATE INDEX "idx_landfill_manager" ON "Landfill"("managerId");

-- CreateIndex
CREATE INDEX "idx_landfill_name" ON "Landfill"("name");

-- CreateIndex
CREATE INDEX "idx_landfill_capacity" ON "Landfill"("capacity");

-- CreateIndex
CREATE UNIQUE INDEX "_PermissionToRole_AB_unique" ON "_PermissionToRole"("A", "B");

-- CreateIndex
CREATE INDEX "_PermissionToRole_B_index" ON "_PermissionToRole"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_LandfillToUser_AB_unique" ON "_LandfillToUser"("A", "B");

-- CreateIndex
CREATE INDEX "_LandfillToUser_B_index" ON "_LandfillToUser"("B");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Role"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PasswordResetToken" ADD CONSTRAINT "PasswordResetToken_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "STS" ADD CONSTRAINT "STS_managerId_fkey" FOREIGN KEY ("managerId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VehicleEntry" ADD CONSTRAINT "VehicleEntry_stsId_fkey" FOREIGN KEY ("stsId") REFERENCES "STS"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VehicleEntry" ADD CONSTRAINT "VehicleEntry_vehicleId_fkey" FOREIGN KEY ("vehicleId") REFERENCES "Vehicle"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VehicleEntry" ADD CONSTRAINT "VehicleEntry_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TruckDumpEntry" ADD CONSTRAINT "TruckDumpEntry_vehicleId_fkey" FOREIGN KEY ("vehicleId") REFERENCES "Vehicle"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TruckDumpEntry" ADD CONSTRAINT "TruckDumpEntry_landfillId_fkey" FOREIGN KEY ("landfillId") REFERENCES "Landfill"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TruckDumpEntry" ADD CONSTRAINT "TruckDumpEntry_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PermissionToRole" ADD CONSTRAINT "_PermissionToRole_A_fkey" FOREIGN KEY ("A") REFERENCES "Permission"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PermissionToRole" ADD CONSTRAINT "_PermissionToRole_B_fkey" FOREIGN KEY ("B") REFERENCES "Role"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_LandfillToUser" ADD CONSTRAINT "_LandfillToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "Landfill"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_LandfillToUser" ADD CONSTRAINT "_LandfillToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
