/* eslint-disable no-return-await */
/* eslint-disable arrow-body-style */
/* eslint-disable import/order */
import prisma from '../../prisma/prisma-client';
import HttpException from '../models/http-exception.model';
// eslint-disable-next-line import/no-extraneous-dependencies
import axios from 'axios';
import { Request } from 'express';

async function isImageURL(url: string) {
  try {
    const response = await axios.head(url);

    if (!response || !response.headers || !response.headers['content-type']) {
      return false;
    }

    return response.headers['content-type'].includes('image/');
  } catch (error) {
    return false;
  }
}

// Function to create a new user
export const createUser = async (userId: number, name: string, image: string) => {
  if (userId && name) {
    // Validate the image URL
    if (image)
      if ((await isImageURL(image)) === false) {
        throw new HttpException(400, 'Invalid image URL.');
      }

    // Try to find the user with the given userId
    const existingUser = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!existingUser) {
      throw new HttpException(404, 'User not found.');
    }

    // Add the new user with role assignment
    return await prisma.user.update({
      where: { id: Number(userId) },
      data: {
        name,
        image: image || undefined,
      },
    });
  }
  throw new HttpException(400, 'Missing required fields: userId, name');
};

// Function to update user
export const updateUser = async (req: Request, userId: number, name: string, image: string) => {
  if (userId) {
    if (!req.user) throw new HttpException(400, 'Invalid token');
    if (req.user.role.type !== 'SystemAdmin' && req.user.id !== userId)
      throw new HttpException(400, 'Not authorized to update user');

    // Validate the image URL
    if (image)
      if ((await isImageURL(image)) === false) {
        throw new HttpException(400, 'Invalid image URL.');
      }

    // Try to find the user with the given userId
    const existingUser = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!existingUser) {
      throw new HttpException(404, 'User not found.');
    }

    // Add the new user with role assignment
    return await prisma.user.update({
      where: { id: Number(userId) },
      data: {
        name: name || 'Unknown',
        image:
          image ||
          'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png',
      },
    });
  }
  throw new HttpException(400, 'Missing required fields: userId');
};

// Function to delete a user
export const deleteUser = async (userId: number) => {
  if (userId) {
    const existingUser = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!existingUser) {
      throw new HttpException(404, 'User not found.');
    }

    return await prisma.user.delete({
      where: { id: Number(userId) },
    });
  }
  throw new HttpException(400, 'Missing required fields: userId.');
};

// Function to list all users
export const listUsers = async () => {
  return await prisma.user.findMany({
    include: {
      role: {
        include: { permissions: true }, // Including permissions information
      },
    }, // Including role information
  });
};

// Function to get specific user
export const getUser = async (userId: string) => {
  if (!userId) throw new HttpException(400, 'Missing required fields: userId');
  return await prisma.user.findUnique({
    where: { id: Number(userId) },
    select: {
      id: true,
      name: true,
      image: true,
      role: {
        select: {
          id: true,
          type: true,
        },
      },
    },
  });
};

// Function to list all roles
export const listRoles = async () => {
  return await prisma.role.findMany({
    include: { permissions: true },
  });
};
// Function to assign a role to a user
export const assignUserRole = async (userId: string, roleId: string) => {
  if (!userId || !roleId) throw new HttpException(400, 'Missing required fields: userId, roleId');
  if (Number(roleId) > 4 || Number(roleId) < 1) throw new HttpException(400, 'Invalid roleId');

  // check if user exists
  const user = await prisma.user.findUnique({ where: { id: Number(userId) } });
  if (!user) {
    throw new HttpException(404, 'User not found.');
  }

  return await prisma.user.update({
    where: { id: Number(userId) },
    data: { role: { connect: { id: Number(roleId) } } },
    include: { role: true },
  });
};

// Function to get profile
export const getProfile = async (userId: string) => {
  if (!userId) throw new HttpException(400, 'Missing required fields: userId');
  return await prisma.user.findUnique({
    where: { id: Number(userId) },
    include: {
      role: {
        include: { permissions: true }, // Including permissions information
      },
    }, // Including role information
  });
};
// Function to update profile
export const updateProfile = async (userId: number, name: string, image: string) => {
  // Validate the image URL
  if (image)
    if ((await isImageURL(image)) === false) {
      throw new HttpException(400, 'Invalid image URL.');
    }

  // Try to find the user with the given userId
  const existingUser = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!existingUser) {
    throw new HttpException(404, 'User not found.');
  }

  // Update the user with the given userId
  return await prisma.user.update({
    where: { id: Number(userId) },
    data: {
      name: name || undefined,
      image: image || undefined,
    },
  });
};

// Function to create a new vehicle
// export const createVehicle = async (vehicleData: {
//   vehicleNumber: string;
//   type: 'OpenTruck' | 'DumpTruck' | 'Compactor' | 'ContainerCarrier';
//   capacity: string;
// }) => {
//   return await prisma.vehicle.create({
//     data: {
//       vehicleNumber: vehicleData.vehicleNumber,
//       type: vehicleData.type,
//       capacity: Number(vehicleData.capacity),
//     },
//   });
// };

// Function to create a new STS
export const createSTS = async (stsData: {
  wardNumber: string;
  capacity: string;
  lat: string;
  lon: string;
  managerId?: string;
}) => {
  return await prisma.sTS.create({
    data: {
      wardNumber: stsData.wardNumber,
      capacity: Number(stsData.capacity),
      currentWasteVolume: 0,
      lat: Number(stsData.lat),
      lon: Number(stsData.lon),
      manager: stsData.managerId ? { connect: { id: Number(stsData.managerId) } } : undefined,
    },
  });
};

// Function to create a new permission
export const createPermission = async (permissionData: { name: string; roleId: number }) => {
  return await prisma.permission.create({
    data: {
      name: permissionData.name,
      role: {
        connect: { id: permissionData.roleId },
      },
    },
  });
};

// Function to list all permissions
export const listPermissions = async () => {
  return await prisma.permission.findMany();
};
