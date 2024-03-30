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
      managers: {
        select: {
          id: true,
          name: true,
        },
        take: 1,
      },
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
  });

  const maximumWasteVolume = stss.reduce((acc, st) => Math.max(acc, st.currentWasteVolume), 0);
  const minimumWasteVolume = stss.reduce(
    (acc, st) => Math.min(acc, st.currentWasteVolume),
    Infinity,
  );

  const totalWastesInAllSts = stss.reduce((acc, st) => acc + st.currentWasteVolume, 0);

  const vehicles = await prisma.vehicle.findMany({
    select: {
      id: true,
      type: true,
      capacity: true,
      registrationNumber: true,
      lat: true,
      lon: true,
      remainingCapacity: true,
      isFull: true,
      vehicleEntries: {
        select: {
          id: true,
          timeOfArrival: true,
          timeOfDeparture: true,
          volumeOfWaste: true,
        },
      },
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
    take: 5,
  });

  const additionalData = [
    {
      name: 'Total STS',
      value: stss.length,
      color: 'blue',
    },
    {
      name: 'Total Vehicles',
      value: vehicles.length,
      color: 'blue',
    },
    {
      name: 'Total Landfills',
      value: landfills.length,
      color: 'blue',
    },
    {
      name: 'Total Wastes',
      value: `${totalWastesInAllSts } Ton` ,
      color: 'blue',
    }
  ];
  return {
    stss,
    vehicles,
    landfills, 
    maximumWasteVolume,
    minimumWasteVolume,
    additionalData,
  };
};
