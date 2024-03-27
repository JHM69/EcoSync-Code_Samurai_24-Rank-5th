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
      { name: 'edit_user'},
      { name: 'view_user'},
      { name: 'edit_role'},
      { name: 'view_role'},
      { name: 'edit_permission'},
      { name: 'view_permission'},
      { name: 'view_sts_entry'},
      { name: 'view_vehicle_entry'},
      { name: 'view_landfill_entry'}, 
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
        connect: [
          { id: 10 },
          { id: 11 },
          { id: 12 },
        ],
      },
    },
  });
    await prisma.role.update({
      where: { id: 3 },
      data: {
        permissions: {
          connect: [
            { id: 7 },
            { id: 8 },
            { id: 9 },
          ],
        },
      },
    });

  console.log('Permissions linked to SystemAdmin Role');

  // Creating a default SystemAdmin user
  const password = '12345678';
  const hashedPassword = await bcrypt.hash(password, 10);
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

  console.log('Default SystemAdmin user created');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    console.log('Seeding completed');
    await prisma.$disconnect();
  });
