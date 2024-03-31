/* eslint-disable no-return-await */
/* eslint-disable no-console */
/* eslint-disable import/prefer-default-export */
import prisma from '../../prisma/prisma-client';
import HttpException from '../models/http-exception.model';

export const connectRoleAndPermissions = async function connectRoleAndPermissions(
  roleId: number,
  permissionIds: number[],
) {
  // Check if the role exists
  const role = await prisma.role.findUnique({
    where: { id: roleId },
    include: { permissions: true }, // Include permissions for the role
  });

  if (!role) {
    throw new HttpException(404, `Role with ID ${roleId} not found.`);
  }
  //   check if permissions exist
  const permissions = await prisma.permission.findMany({
    where: { id: { in: permissionIds } },
  });
  if (permissions.length !== permissionIds.length) {
    throw new HttpException(404, 'One or more permissions not found.');
  }

  // Disconnect all existing permissions from the role
  await prisma.role.update({
    where: { id: roleId },
    data: {
      permissions: {
        disconnect: role.permissions.map(permission => ({ id: permission.id })),
      },
    },
  });

  console.log('All existing permissions disconnected successfully.');

  // Connect the new permissions to the role
  await prisma.role.update({
    where: { id: roleId },
    data: {
      permissions: {
        connect: permissionIds.map(permissionId => ({ id: permissionId })),
      },
    },
  });

  console.log('All permissions connected successfully.');

  // Return the updated role with permissions included
  return await prisma.role.findUnique({
    where: { id: roleId },
    include: { permissions: true },
  });
};
