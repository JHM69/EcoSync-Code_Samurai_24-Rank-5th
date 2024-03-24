/* eslint-disable no-return-await */
/* eslint-disable arrow-body-style */
/* eslint-disable import/order */
import prisma from '../../prisma/prisma-client'; 
 
 
// Function to create a new user with role assignment
// eslint-disable-next-line import/prefer-default-export
export const dumpIntoLandfill = async (entryData: { 
  vehicleNumber: string; 
  landfillId : string, 
  volumeOfWaste : string,
  timeOfArrival : string,
  timeOfDeparture : string,
  userId : string
}) => {
return await prisma.truckDumpEntry.create({
  data: {
    vehicle: {
      connect: { vehicleNumber: entryData.vehicleNumber },
    },
    volumeOfWaste : Number(entryData.volumeOfWaste),
    timeOfArrival: new Date( entryData.timeOfArrival),
    timeOfDeparture: new Date( entryData.timeOfDeparture),
    landfill: {
      connect: { id: Number(entryData.landfillId) },
    },
    user : {
      connect : { id : Number(entryData.userId)} }
  },
});
};
