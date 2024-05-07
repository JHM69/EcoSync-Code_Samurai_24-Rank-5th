/* eslint-disable no-return-await */
/* eslint-disable arrow-body-style */
/* eslint-disable import/order */
// @ts-nocheck
import prisma from '../../prisma/prisma-client'; 
 

// eslint-disable-next-line import/prefer-default-export
export const createVehicleEntry = async (
  vehicleEntryData: { 
    vehicleNumber: string; 
    stsId : string, 
    volumeOfWaste : string,
    timeOfArrival : string,
    timeOfDeparture : string,
    userId : string
}) => {
  return await prisma.vehicleEntry.create({
    data: {
      vehicle: {
        connect: { vehicleNumber: vehicleEntryData.vehicleNumber },
      },
      volumeOfWaste : Number(vehicleEntryData.volumeOfWaste),
      timeOfArrival: new Date( vehicleEntryData.timeOfArrival),
      timeOfDeparture: new Date( vehicleEntryData.timeOfDeparture),
      sts: {
        connect: { id: Number(vehicleEntryData.stsId) },
      },
      user : {
        connect : { id : Number(vehicleEntryData.userId)} }
    },
  });
};


export const createSTS = async (stsData: {
  wardNumber: string;
  name?: string;
  capacity: string;
  lat: string;
  lon: string;
  managerIds?: string[];
  address?: string;
  logo?: string;
  vehicleIds?: string[];
}) => {
  const managerIds = stsData.managerIds ? stsData.managerIds.map(id => Number(id)) : [];
  const vehicleIds = stsData.vehicleIds ? stsData.vehicleIds.map(id => Number(id)) : [];

  return await prisma.sTS.create({
    data: {
      wardNumber: stsData.wardNumber,
      name: stsData.name,
      capacity: Number(stsData.capacity),
      currentWasteVolume: 0,
      lat: Number(stsData.lat),
      lon: Number(stsData.lon),
      address: stsData.address,
      logo: stsData.logo,
      vehicles: {
        connect: vehicleIds.map(id => ({ id })), // Connect vehicles by id
      },
      managers: {
        connect: managerIds.map(id => ({ id })),
      },
    },
    include: {
      managers: true,
      vehicles: true,
    },
  });
};


export const updateSTS = async (
  stsData: {
    wardNumber?: string;
    name?: string;
    capacity?: string;
    currentWasteVolume?: string;
    lat?: string;
    lon?: string;
    managerIds?: string[];
    address?: string;
    logo?: string;
    vehicleIds?: string[];
  },
  id: number,
) => {
  const managerIds = stsData.managerIds ? stsData.managerIds.map(id => Number(id)) : [];
  const vehicleIds = stsData.vehicleIds ? stsData.vehicleIds.map(id => Number(id)) : [];

  if (stsData.managerIds) {
    // remove all managers
    await prisma.sTS.update({
      where: {
        id,
      },
      data: {
        managers: {
          set: [],
        },
      },
    });
  }
  if (stsData.vehicleIds) {
    // remove all vehicles
    await prisma.sTS.update({
      where: {
        id,
      },
      data: {
        vehicles: {
          set: [],
        },
      },
    });
  }

  let capacity; let currentWasteVolume; let lat; let lon;
  if (stsData.capacity) {
    capacity = Number(stsData.capacity);
  }
  if (stsData.currentWasteVolume) {
    currentWasteVolume = Number(stsData.currentWasteVolume);
  }
  if (stsData.lat) {
    lat = Number(stsData.lat);
  }
  if (stsData.lon) {
    lon = Number(stsData.lon);
  }

  return await prisma.sTS.update({
    where: {
      id,
    },
    data: {
      wardNumber: stsData.wardNumber,
      name: stsData.name,
      capacity,
      currentWasteVolume,
      lat,
      lon,
      address: stsData.address,
      logo: stsData.logo,
      vehicles: {
        connect: vehicleIds.map(id => ({ id })),
      },
      managers: {
        connect: managerIds.map(id => ({ id })),
      },
    },
    include: {
      managers: true,
      vehicles: true,
    },
  });
};