/* eslint-disable no-return-await */
/* eslint-disable arrow-body-style */
/* eslint-disable import/order */
import prisma from '../../prisma/prisma-client'; 
 
 
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

module.exports = {
    calculateAndSaveBillingRecords,
};
