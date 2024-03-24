/* eslint-disable no-return-await */
/* eslint-disable arrow-body-style */
/* eslint-disable import/order */
import prisma from '../../prisma/prisma-client'; 
 
 
// Function to create a new user with role assignment
export const createUser = async (userData: { email: string; name: string; password: string; roleId: string }) => {
  // Assuming password hashing and other validations are handled elsewhere
  // eslint-disable-next-line no-return-await
  return await prisma.user.create({
    data: {
      email: userData.email,
      name: userData.name,
      password: userData.password,
      role: {
        connect: { id: Number(userData.roleId) },
      },
    },
  });
};

// Function to assign a role to a user
export const assignUserRole = async (userId: string, roleId: string) => {
  return await prisma.user.update({
    where: { id: Number(userId) },
    data: { role: { connect: { id: Number(roleId) } } },
  });
};

// Function to list all users
export const listUsers = async () => {
  return await prisma.user.findMany({
    include: { role: {
      include: { permissions: true }, // Including permissions information
    } }, // Including role information
  });
};

// Function to create a new role
export const createRole = async (roleType: 'SystemAdmin' | 'STSManager' | 'LandfillManager' | 'Unassigned') => {
  return await prisma.role.create({
    data: { type: roleType },
  });
};

// Function to list all roles
export const listRoles = async () => {
  return await prisma.role.findMany(
    {
      include: { permissions: true }, 
    },
  );
};

// Function to create a new vehicle
export const createVehicle = async (vehicleData: { vehicleNumber: string; type:  
  'OpenTruck' | 'DumpTruck'  | 'Compactor' | 'ContainerCarrier'; capacity: string }) => {
  return await prisma.vehicle.create({
    data: {
      vehicleNumber: vehicleData.vehicleNumber,
      type: vehicleData.type,
      capacity: Number(vehicleData.capacity),
    },
  });
};

// Function to create a new STS
export const createSTS = async (stsData: { wardNumber: string; capacity: string; lat: string; lon: string; managerId?: string }) => {
  return await prisma.sTS.create({
    data: {
      wardNumber: stsData.wardNumber,
      capacity: Number(stsData.capacity),
      currentWasteVolume: 0, // Add the missing property
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
  return await prisma.permission.findMany({
    include: { role: true }, // Including role information for context
  });
};
