/* eslint-disable arrow-body-style */
/* eslint-disable import/prefer-default-export */

import prisma from '../../prisma/prisma-client';

export const dashboardData = async (
  startDate: string,
  endDate: string,
) => {

  const start = startDate ? new Date(startDate) : new Date();
  start.setHours(0, 0, 0, 0); // This ensures the start of the day is used if startDate is provided.

  const end = endDate ? new Date(endDate) : new Date(); // Uses the current date if endDate is not provided.

  const whereCondition = {
    createdAt: {
      gte: startDate ? start : undefined,
      lte: endDate ? end : undefined,
    }, 
  };

  const stss = await prisma.sTS.findMany({
    select: {
      id: true,
      wardNumber: true,
      name: true,
      lat: true,
      lon: true,
      capacity: true,
      currentWasteVolume: true,
      managers: {
        select: {
          id: true,
          name: true,
        },
        take: 2,
      },
      vehicleEntries: {
        where: whereCondition,
        select: {
          id: true, 
          volumeOfWaste: true,
        },
      },
    },
    take: 54,
  });

  const initialValues = {
    maximumWasteVolume: 0,
    minimumWasteVolume: Infinity,
    totalWastesInAllSts: 0,
  };

  const result = stss.reduce((acc, st) => {
    return {
      maximumWasteVolume: Math.max(acc.maximumWasteVolume, st.currentWasteVolume),
      minimumWasteVolume: Math.min(acc.minimumWasteVolume, st.currentWasteVolume),
      totalWastesInAllSts: acc.totalWastesInAllSts + st.currentWasteVolume,
    };
  }, initialValues);

  const { maximumWasteVolume, minimumWasteVolume, totalWastesInAllSts } = result;
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
    },
  });

  const landfills = await prisma.landfill.findMany({
    select: {
      id: true,
      lat: true,
      lon: true,
      name: true,
      capacity: true,
      currentWasteVolume: true,
      truckDumpEntries: {
        where: whereCondition,
        select: {
          id: true,
          volumeOfWaste: true,
        },
      },
      trips: true,
    },
    take: 5,
  });

  const totalWasteDumpedInLandfills = landfills.reduce(
    (acc, landfill) => acc + landfill.currentWasteVolume,
    0,
  );

  const additionalData = [
    {
      name: 'STS',
      value: stss.length,
    },
    {
      name: 'Vehicles',
      value: vehicles.length,
    },
    {
      name: 'Landfills',
      value: landfills.length,
    },
    {
      name: 'Wastes in STS',
      value: `${totalWastesInAllSts.toFixed(2)} Ton`,
    },
    {
      name: 'Waste Dumped',
      value: `${totalWasteDumpedInLandfills.toFixed(2)} Ton`,
    },
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

export const getBillsData = async (
  startDate: string,
  endDate: string,
  vehicleId: string,
  stsId: string,
  landfillId: string,
  isVerified: string,
  isPaid: string,
  page: string,
  limit: string,
) => {
  const start = startDate ? new Date(startDate) : new Date();
  start.setHours(0, 0, 0, 0); // This ensures the start of the day is used if startDate is provided.

  const end = endDate ? new Date(endDate) : new Date(); // Uses the current date if endDate is not provided.

  const whereCondition = {
    createdAt: {
      gte: startDate ? start : undefined,
      lte: endDate ? end : undefined,
    },
    vehicleEntry: {
      vehicleId: vehicleId ? Number(vehicleId) : undefined,
      stsId: stsId ? Number(stsId) : undefined,
      landfillId: landfillId ? Number(landfillId) : undefined,
    },
    isVerified: isVerified !== undefined ? isVerified === 'true' : undefined,
    paid: isPaid !== undefined ? isPaid === 'true' : undefined,
  };

  const bills = await prisma.bill.findMany({
    where: whereCondition,
    include: {
      trip: {
        include: {
          vehicleEntries: true,
      }
    },
    },
    orderBy: {
      createdAt: 'desc',
    },
    skip: page ? Number(page) : 0,
    take: limit ? Number(limit) : 50,
  });

  const totals = bills.reduce(
    (acc, bill) => {
      acc.totalCost += bill.amount;
      acc.totalDistance += bill.trip.distance;
      acc.totalWasteTransported += bill.trip.vehicleEntries[0].volumeOfWaste;
      if (bill.paid) acc.paidCost += bill.amount;
      return acc;
    },
    { totalCost: 0, totalDistance: 0, totalWasteTransported: 0, paidCost: 0 },
  );

  const totalBills = bills.length;

  const additionalData = [
    {
      name: 'Bills Generated',
      value: totalBills,
      unit: '',
    },
    {
      name: 'Total Cost',
      value: `${totals.totalCost.toFixed(2)} Tk`,
    },

    {
      name: 'Total Distance',
      value: `${totals.totalDistance.toFixed(2)} Km`,
    },
    {
      name: 'Waste Transported',
      value: `${totals.totalWasteTransported.toFixed(2)} Ton`,
    },
  ];

  return {
    bills,
    additionalData,
  };
};

export const getBillFilterData = async () => {
  const vehicles = await prisma.vehicle.findMany({
    select: {
      id: true,
      registrationNumber: true,
    },
  });
  const stss = await prisma.sTS.findMany({
    select: {
      id: true,
      name: true,
      wardNumber: true,
    },
  });

  const landfills = await prisma.landfill.findMany({
    select: {
      id: true,
      name: true,
    },
  });

  return {
    vehicles,
    stss,
    landfills,
  };
};
