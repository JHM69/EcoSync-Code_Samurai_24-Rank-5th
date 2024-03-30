/* eslint-disable consistent-return */
/* eslint-disable import/first */
import { Request, Response, Router } from 'express';
import auth from '../utils/auth';
import prisma from '../../prisma/prisma-client';
import { getHtml } from '../services/pdf.service';
import axios from 'axios';

const puppeteer = require('puppeteer');

const router = Router();

const createBill = async (id: string, userId: number) => {
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
  // check if the req user id has sts access vehicle entry stsId
  const sts = await prisma.sTS.findFirst({
    where: {
      id: VehicleEntry.stsId,
      managers: {
        some: {
          // @ts-ignore
          id: userId,
        },
      },
    },
  });
  if (!sts) {
    throw new Error('You are not a manager of this STS');
  }

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
  };
  const { unloadedFuelCost } = VehicleEntry.vehicle;
  const { loaddedFuelCost } = VehicleEntry.vehicle;
  const { volumeOfWaste } = VehicleEntry;
  const { capacity } = VehicleEntry.vehicle;
  bill.cost = unloadedFuelCost + (volumeOfWaste / capacity) * (loaddedFuelCost - unloadedFuelCost);
  return bill;
};

router.get('/bill', auth.required, async (req: Request, res: Response) => {
  try {
    const bills = await prisma.bill.findMany({
      include: {
        vehicleEntry: {
          include: {
            vehicle: true,
          },
        },
      },
    });
    return res.json(bills);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
});

router.get('/bill/:id', auth.required, async (req: Request, res: Response) => {
  try {
    // @ts-ignore
    const bill = await prisma.bill.findUnique({
      where: {
        id: Number(req.params.id),
      },
      include: {
        vehicleEntry: {
          include: {
            vehicle: true,
          },
        },
      },
    });
    return res.json(bill);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
});

router.get('/bill/:id/download', auth.required, async (req: Request, res: Response) => {
  try {
    // @ts-ignore
    const bill = await prisma.bill.findUnique({
      where: {
        id: Number(req.params.id),
      },
      include: {
        vehicleEntry: {
          include: {
            vehicle: true,
          },
        },
      },
    });
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setContent(
      getHtml(
        bill.id,
        bill.createdAt,
        bill.vehicleEntry.timeOfArrival,
        bill.vehicleEntry.timeOfDeparture,
        bill.vehicleEntry.volumeOfWaste,
        bill.vehicleEntry.vehicle.id,
        bill.vehicleEntry.vehicle.registrationNumber,
        bill.vehicleEntry.vehicle.type,
        bill.vehicleEntry.vehicle.unloadedFuelCost,
        bill.vehicleEntry.vehicle.loaddedFuelCost,
        bill.vehicleEntry.vehicle.capacity,
        bill.amount,
        bill.distance,
        bill.duration,
      ),
    );
    const pdfBuffer = await page.pdf({ format: 'A4' });

    res.contentType('application/pdf');
    res.send(pdfBuffer);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
});

// router.get('/distance', async (req: Request, res: Response) => {
//   try {
//     const { from, to } = req.query;
//     const {distance, duration} = await fetchDirections(from as string, to as string, "AIzaSyCePkfLfau3i98g4UC4AnOvt5Qnc-5DCHI");
//     return res.json({ distance, duration });
//   } catch (error: any) {
//     res.status(400).json({ message: error.message });
//   }
// });

export default router;
