/* eslint-disable import/prefer-default-export */

import prisma from '../../prisma/prisma-client'; 


export const dashboardData = async () => {
 
  const stss = await prisma.sTS.findMany({
    select: {
      id: true,
      wardNumber: true,
      lat: true,
      lon: true,
      capacity: true,
      currentWasteVolume: true,
      vehicleEntries: {
        select: {
          id: true,
          timeOfArrival: true,
          timeOfDeparture: true,
          volumeOfWaste: true,
        },
      },
    },
    take: 54,
    orderBy: {
      currentWasteVolume: 'desc',
    },
  });

  const vehicles = await prisma.vehicle.findMany({
    select: { id: true, type: true, capacity: true,
      registrationNumber: true,
      lat : true,
      lon : true,
      remainingCapacity : true,
      isFull : true,
      vehicleEntries: {
        select: {
          id: true,
          timeOfArrival: true,
          timeOfDeparture: true,
          volumeOfWaste: true,
        },
      },
     },
     take: 50,
     orderBy: {
        remainingCapacity: 'asc',
      },
  });

  const landfills = await prisma.landfill.findMany({
    select: {
      id: true,
      lat: true,
      lon: true,
      capacity: true,
      currentWasteVolume: true,
      truckDumpEntries: {
        select: {
          id: true,
          timeOfArrival: true,
          timeOfDeparture: true,
          volumeOfWaste: true,
        },
      },
    },
    take: 50,
    orderBy: {
      currentWasteVolume: 'desc',
    },
  });

  return {
    stss,
    vehicles,
    landfills
  };
};