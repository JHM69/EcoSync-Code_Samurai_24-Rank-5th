/* eslint-disable object-shorthand */
/* eslint-disable no-console */
/* eslint-disable no-else-return */
/* eslint-disable no-return-await */
/* eslint-disable arrow-body-style */
/* eslint-disable import/order */
import prisma from '../../prisma/prisma-client'; 
import axios from 'axios';
 
 
const oilAllocations = { // Oil allocation per vehicle type in Full Capacity per trip
    'OpenTruck': 10, 
    'DumpTruck': 15,
    'Compactor': 20,
    'ContainerCarrier': 25
};

// eslint-disable-next-line import/prefer-default-export
export async function calculateAndSaveBillingRecords(startDate : string, endDate  : string) {
    // Assume that `VehicleEntry` records are already populated for each trip
    // Calculate the billing records based on the total volume of waste per vehicle between startDate and endDate

    // Fetching all vehicle IDs first to iterate over them
    const vehicles = await prisma.vehicle.findMany({
        select: { id: true, type: true, capacity: true }
    });

    // Preparing for bulk creation of billing records
    const billingRecordsData : any[] = [];

    // eslint-disable-next-line no-restricted-syntax
    for (const vehicle of vehicles) {
        // eslint-disable-next-line no-await-in-loop
        const entries = await prisma.vehicleEntry.findMany({
            where: {
                vehicleId: vehicle.id,
                AND: [
                    { timeOfArrival: { gte: startDate } },
                    { timeOfDeparture: { lte: endDate } }
                ],
            }
        });

        // Summing the volume of waste for this vehicle in the given period
        const totalVolumeOfWaste = entries.reduce((sum, entry) => sum + entry.volumeOfWaste, 0);
        const totalCapacityForPeriod = vehicle.capacity * 3 * entries.length / 3; // Assuming 3 trips per day for each day in the period

        const capacityUtilization = totalVolumeOfWaste / totalCapacityForPeriod;
        const oilAllocation = (oilAllocations[vehicle.type] * capacityUtilization) * entries.length / 3; // Oil allocation based on the number of days active

        billingRecordsData.push({
            vehicleId: vehicle.id,
            date: endDate, // Using endDate as the reference for this billing period
            volumeOfWaste: totalVolumeOfWaste,
            capacityUtilization,
            oilAllocated: oilAllocation,
            totalVolumeOfWaste,
            totalCapacityForPeriod,
        });

    }

    return billingRecordsData;

}

const fetchDirections = async (origin: string, destination: string) => {
    try {
        const response = await axios.get('https://maps.googleapis.com/maps/api/directions/json', {
            params: {
                origin: origin, 
                destination: destination, 
                key: process.env.GOOGLE_API_KEY,
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
        throw new Error('Error fetching directions');
    }
};

export const createBill = async (id: string, userId: number, stsId:number, landfillId?:number) => {
    // get sts entry by id
    const VehicleEntry = await prisma.vehicleEntry.findUnique({
      where: {
        id: Number(id),
      },
      include: {
        vehicle: true,
      },
    });
    if (!VehicleEntry) {
      throw new Error('Vehicle Entry not found');
    }
    // get lat lon of sts
    const sts = await prisma.sTS.findUnique({
      where: {
        id: stsId,
      },
    });
    // get lat lon of landfill
    let landfillIdNumber=1;
    if(landfillId)landfillIdNumber=Number(landfillId);
    const landfill = await prisma.landfill.findUnique({
      where: {
        id: landfillIdNumber,
      },
    });
  
    // get distance and duration between sts and landfill
    const from = `${sts?.lat},${sts?.lon}`;
    const to = `${landfill?.lat},${landfill?.lon}`;
    const {distance, duration} = await fetchDirections(from as string, to as string);
    // calculate the cost
    const bill = {
      entryid: VehicleEntry.id,
      billCreatedAt: new Date(),
      timeOfArrival: VehicleEntry.timeOfArrival,
      timeOfDeparture: VehicleEntry.timeOfDeparture,
      volumeOfWaste: VehicleEntry.volumeOfWaste,
      truckId: VehicleEntry.vehicle.id,
      truckRegistrationNumber: VehicleEntry.vehicle.registrationNumber,
      truckType: VehicleEntry.vehicle.type,
      unloadedFuelCost: VehicleEntry.vehicle.unloadedFuelCost,
      loaddedFuelCost: VehicleEntry.vehicle.loaddedFuelCost,
      capacity: VehicleEntry.vehicle.capacity,
      cost: 0,
      assigneeId: userId,
      distance: distance,
      duration: duration,
    };
    const unloadedFuelCost = VehicleEntry?.vehicle.unloadedFuelCost;
    const loaddedFuelCost = VehicleEntry?.vehicle.loaddedFuelCost;
    const volumeOfWaste = VehicleEntry?.volumeOfWaste;
    const capacity = VehicleEntry?.vehicle.capacity;
    
    bill.cost = (unloadedFuelCost + (volumeOfWaste / capacity) * (loaddedFuelCost - unloadedFuelCost))*distance;
    console.log(bill.cost);
    const createdBill = await prisma.bill.create({
        data:{
            vehicleEntryId: VehicleEntry.id,
            amount: bill.cost,
            distance: Number(distance),
            duration: Number(duration),
        },
        include: {
            vehicleEntry: true,
        }
        });
    console.log('Bill created:', createdBill);
    return createdBill;
  };

module.exports = {
    calculateAndSaveBillingRecords,
    fetchDirections,
    createBill
};
