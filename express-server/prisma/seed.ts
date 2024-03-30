/* eslint-disable no-console */
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding roles and permissions');
  await prisma.role.createMany({
    data: [
      { type: 'SystemAdmin' },
      { type: 'STSManager' },
      { type: 'LandfillManager' },
      { type: 'Unassigned' },
    ],
    skipDuplicates: true, // Skip if already exists
  });

  console.log('Roles created');

  // Permissions creation
  await prisma.permission.createMany({
    data: [
      { name: 'edit_sts_entry' },
      { name: 'edit_vehicle_entry' },
      { name: 'edit_landfill_entry' },
      { name: 'edit_user' },
      { name: 'view_user' },
      { name: 'edit_role' },
      { name: 'view_role' },
      { name: 'edit_permission' },
      { name: 'view_permission' },
      { name: 'view_sts_entry' },
      { name: 'view_vehicle_entry' },
      { name: 'view_landfill_entry' },
    ],
    skipDuplicates: true,
  });

  console.log('Permissions created');

  // Link permissions to SystemAdmin Role
  // Assuming the SystemAdmin role is the first to be inserted and has id=1
  await prisma.role.update({
    where: { id: 1 },
    data: {
      permissions: {
        connect: [
          { id: 1 },
          { id: 2 },
          { id: 3 },
          { id: 4 },
          { id: 5 },
          { id: 6 },
          { id: 7 },
          { id: 8 },
          { id: 9 },
          { id: 10 },
          { id: 11 },
          { id: 12 },
        ],
      },
    },
  });
  await prisma.role.update({
    where: { id: 2 },
    data: {
      permissions: {
        connect: [{ id: 10 }, { id: 11 }, { id: 12 }],
      },
    },
  });
  await prisma.role.update({
    where: { id: 3 },
    data: {
      permissions: {
        connect: [{ id: 7 }, { id: 8 }, { id: 9 }],
      },
    },
  });

  console.log('Permissions linked to SystemAdmin Role');

  // Creating a default SystemAdmin user
  const password = '12345678';
  const hashedPassword = await bcrypt.hash(password, 10);
  const existingUser = await prisma.user.findUnique({
    where: { email: 'jahangirhossainm69@gmail.com' },
  });

  if (!existingUser) {
    await prisma.user.create({
      data: {
        email: 'jahangirhossainm69@gmail.com',
        name: 'Jahangir Hossain',
        password: hashedPassword, // Encrypted password
        role: {
          connect: { id: 1 }, // Connecting to SystemAdmin role
        },
      },
    });
  } else {
    await prisma.user.update({
      where: { email: 'jahangirhossainm69@gmail.com' },
      data: {
        password: hashedPassword,
        role: {
          connect: { id: 1 },
        },
      },
    });
  }
  console.log('Default SystemAdmin user created');

  const stsData = [
    {
      name: 'Secondary Waste Transfer Station',
      lat: 23.77295889,
      lon: 90.41515368,
      wardNumber: '1',
      address: 'Niketon area, near bir uttam shakwat road',
      capacity: 1000,
      currentWasteVolume: 244,
    },
    {
      name: 'Rampura Secondary Transfer Station',
      lat: 23.76760376,
      lon: 90.42342778,
      wardNumber: '23',
      address: 'Rampura, near banasree main rd',
      currentWasteVolume: 55,
      capacity: 1000,
    },
    {
      name: 'Pallabi Secondary Transfer Station',
      lat: 23.82748171604551,
      lon: 90.36451602161833,
      wardNumber: '52',
      address: 'near pallabi police station',
      currentWasteVolume: 0,
      capacity: 1000,
    },
    {
      name: 'Khilkhet Secondary Transfer Station',
      lat: 23.830295942821408,
      lon: 90.42214421783969,
      wardNumber: '17',
      address: 'near khilkhet high school',
      currentWasteVolume: 132,
      capacity: 1000,
    },
    {
      name: 'Rupnagar Secondary Transfer Station',
      lat: 23.820207280517298,
      lon: 90.35480434604217,
      wardNumber: '6',
      address: 'near rupnagar abashik area',
      currentWasteVolume: 0,
      capacity: 1000,
    },
    {
      name: 'Mirpur Secondary Transfer Station',
      lat: 23.813600544288484,
      lon: 90.3663055954331,
      wardNumber: '13',
      address: 'near mirpur 10 no. bridge',
      currentWasteVolume: 0,
      capacity: 1000,
    },
  ];

  // create STS form the array
  await prisma.sTS.createMany({
    data: stsData,
    skipDuplicates: true,
  });
  console.log('Default STSs created');

  // Create Landfill
  await prisma.landfill.create({
    data: {
      name: 'Aminbazar Landfill',
      lat: 23.7833076,
      lon: 90.329124,
      address: 'near aminbazar bridge',
      capacity: 10000,
      currentWasteVolume: 0,
      startTime: '08:00',
      endTime: '18:00',
      gpsCoords: '23.8103,90.4125',
    },
  });
  console.log('Default Landfill created');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    console.log('Seeding completed');
    await prisma.$disconnect();
  });
