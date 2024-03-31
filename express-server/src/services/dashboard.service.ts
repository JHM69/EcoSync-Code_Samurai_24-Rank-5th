/* eslint-disable import/prefer-default-export */

import prisma from '../../prisma/prisma-client';

export const dashboardData = async () => {
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
      name: true,
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

       
    },
    {
      name: 'Total Vehicles',
      value: vehicles.length, 

       
    },
    {
      name: 'Total Landfills',
      value: landfills.length, 
      
    },
    {
      name: 'Total Wastes',
      value: `${totalWastesInAllSts.toFixed(2)} Ton`,
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


export const getBillsData = async (starDate : string , endDate : string) => {

 
  let start = new Date(starDate);
  let end = new Date(endDate);

 
  if(!starDate){ 
    start = new Date();
    start.setHours(0,0,0,0);
  }
  if(!endDate){
    end = new Date();
  }
  const bills = await prisma.bill.findMany({
    where: {
      createdAt: {
        gte: start.toISOString(),
        lte: end.toISOString(),
      },
    },
    include: {
      vehicleEntry: {
        include: {
          vehicle: true,
          sts: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  const totals = bills.reduce((acc, bill) => {
    acc.totalCost += bill.amount;
    acc.totalDistance += bill.distance;
    acc.totalWasteTransported += bill.vehicleEntry.volumeOfWaste;
    if(bill.paid) acc.paidCost += bill.amount;
    return acc;
  }, { totalCost: 0, totalDistance: 0, totalWasteTransported: 0, paidCost : 0});
  
  const totalBills = bills.length;

  const additionalData = [
    {
      name: 'Bills Generated',
      value: totalBills,
      unit : ''
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
    }
  ];

  return {
    bills,
    additionalData,
  };
}


   
