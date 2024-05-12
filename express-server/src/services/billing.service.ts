/* eslint-disable object-shorthand */
/* eslint-disable no-console */
/* eslint-disable no-else-return */
/* eslint-disable no-return-await */
/* eslint-disable arrow-body-style */
/* eslint-disable import/order */
import prisma from '../../prisma/prisma-client'; 
import axios from 'axios';

export const fetchDirections = async (origin: string, destination: string) => {
    try {
        const response = await axios.get('https://maps.googleapis.com/maps/api/directions/json', {
            params: {
                origin: origin, 
                destination: destination, 
                key: "API_KEY",
            },
        });

        if (response.data.status === "OK") {
            const route = response.data.routes[0];
            const distanceInMeters = route.legs[0].distance.value;
            const distanceInKilometers = distanceInMeters / 1000;
            const duration = route.legs[0].duration.value;
            const durationInMinutes = duration / 60;
            console.log(`Distance: ${distanceInKilometers} km, Duration: ${durationInMinutes} minutes`);
            return { distance: distanceInKilometers, duration: durationInMinutes };
        } else {
            throw new Error(response.data.error_message || "Failed to fetch data");
        }
    } catch (error) {
        console.error('Error fetching directions:', error);
        // throw new Error('Error fetching directions');
        return { distance: 15.2, duration: 20.3 };
    }
};

export const createBill = async (tripId:number)=>{
    const trip = await prisma.trip.findUnique({
        where: { id: tripId },
        include: {
          vehicle: true,
          driver: true,
          startLandfill: true,
          vehicleEntries: {
            include: {
              sts: true,
            },
          },
          vehicleMetas: {
            orderBy: {
              id: 'asc',
            },
          },
          truckDumpEntries: {
            include: {
              landfill: true,
            },
          },
          bill: true,
        },
      });

    //create an array to keep lat lon
    let latLonArray=[];
    latLonArray.push(`${trip.startLandfill.lat},${trip.startLandfill.lon},0`);
    trip.vehicleMetas.forEach((meta)=>{
        latLonArray.push(`${meta.lat},${meta.lon},${meta.weight}`);
    });
    latLonArray.push(`${trip.truckDumpEntries[0].landfill.lat},${trip.truckDumpEntries[0].landfill.lon},0`);

    let distance=0, amount=0;
    for(let i=0;i<latLonArray.length-1;i++){
        const from = latLonArray[i];
        const to = latLonArray[i+1];
        const d=latLonDistance(Number(from.split(",")[0]), Number(from.split(",")[1]), Number(to.split(",")[0]), Number(to.split(",")[1]));
        distance+=d;
        amount+=getAmount(d, trip.vehicle.unloadedFuelCost, trip.vehicle.loaddedFuelCost, Number(from.split(",")[2]), trip.vehicle.capacity);
    }
   // duration of the trip
   const duration = (trip.truckDumpEntries[0].timeOfDeparture.getTime()-trip.createdAt.getTime())/60000;
  
   
   const bill = await prisma.bill.create({
        data:{
            amount: amount,
            trip: {
                connect: {
                    id: tripId,
                },
            },
        }
    });

    await prisma.trip.update({
        where: {
          id: tripId,
        },
        data: {
          bill: {
            connect: {
              id: bill.id,
            },
          },
          distance: distance,
          duration: duration,
        },
      });

      return bill;
}

//create a function that will calculate the distance between two lat lon mathematically
export const latLonDistance = (lat1:number, lon1:number, lat2:number, lon2:number)=>{
    const R = 6371e3; // metres
    const φ1 = lat1 * Math.PI/180; // φ, λ in radians
    const φ2 = lat2 * Math.PI/180;
    const Δφ = (lat2-lat1) * Math.PI/180;
    const Δλ = (lon2-lon1) * Math.PI/180;
    const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ/2) * Math.sin(Δλ/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const d = R * c; // in metres
    return d;
}

const getAmount = (distance:number, unloadedFuelCost:number, loaddedFuelCost:number, volumeOfWaste:number, capacity:number)=>{
    return (unloadedFuelCost + (volumeOfWaste / capacity) * (loaddedFuelCost - unloadedFuelCost))*distance;
}

export const createContractorBill = async (contractorId: number) => {
  try{
    // get the contractor
  const contractor = await prisma.contractor.findUnique({
    where: {
      id: contractorId,
    },
    include: {
      sts: true,
    }
  });
  // get todays waste entries for the contractor
  const wasteEntries = await prisma.wasteEntry.findMany({
    where: {
      contractorId: contractorId,
      createdAt: {
        gte: new Date(new Date().setHours(0o0, 0o0, 0o0)),
        lte: new Date(new Date().setHours(23, 59, 59))
      }
    },
  });

  let totalWaste = 0;
  for (let i = 0; i < wasteEntries.length; i++) {
    totalWaste += wasteEntries[i].volumeOfWaste;
  }
  totalWaste/=1000; //to ton
  
  const baseAmount = totalWaste * contractor.paymentPerTonnage;
  let deficit = 0;
  if (totalWaste < contractor.requiredWastePerDay) {
    deficit = (contractor.requiredWastePerDay - totalWaste);
  }
  const fine = deficit *contractor.sts.fine;
  const totalAmount = baseAmount - fine;

  // create the contractor bill
  const bill = await prisma.contractorBill.create({
    data: {
      contractor: {
        connect: {
          id: contractorId,
        },
      },
      baseAmount: baseAmount,
      totalAmount: totalAmount,
      fine: fine,
      collectedWaste: totalWaste,
      requiredWaste: contractor.requiredWastePerDay,
    },
  });
  return bill;
  }catch(error){
      throw new Error(error.message);
  }
};
