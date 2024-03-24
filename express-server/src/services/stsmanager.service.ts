/* eslint-disable no-return-await */
/* eslint-disable arrow-body-style */
/* eslint-disable import/order */
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
