/* eslint-disable consistent-return */
/* eslint-disable import/first */
import { Request, Response, Router } from 'express';
import auth from '../utils/auth';
import prisma from '../../prisma/prisma-client';
import { getHtml, getHtml2 } from '../services/pdf.service';
import { createContractorBill } from '../services/billing.service';
 
const puppeteer = require('puppeteer');

const router = Router();


// router.post('/bill', auth.required, async (req: Request, res: Response) => {
//   try {
//     const { tripId} = req.body;
//     const bill = await createBill(tripId);
//     return res.status(201).json(bill);
//   } catch (error: any) {
//     return res.status(400).json({ message: error.message });
//   }
// });

router.get('/bill', auth.required, async (req: Request, res: Response) => {
  try {
    const bills = await prisma.bill.findMany({
      include: {
        trip: {
          include: {
            vehicle: true,
            driver: {
              select: {
                name: true,
                email: true,
                phone: true,
                image: true,
                drivingLicense: true,
              },
            },
            startLandfill: true,
            vehicleEntries: true,
            truckDumpEntries: true,
        },
        }
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
        trip: {
          include: {
            vehicle: true,
            driver: {
              select: {
                name: true,
                email: true,
                phone: true,
                image: true,
                drivingLicense: true,
              },
            },
            startLandfill: true,
            vehicleEntries: true,
            truckDumpEntries: true,
        },
        }
      },
    });
    return res.json(bill);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
});

router.get('/bill/:id/download', async (req: Request, res: Response) => {
  try {
    // @ts-ignore
    const bill = await prisma.bill.findUnique({
      where: {
        id: Number(req.params.id),
      },
      include: {
        trip: {
          include: {
            vehicle: true,
            driver: {
              select: {
                name: true,
                email: true,
                phone: true,
                image: true,
                drivingLicense: true,
              },
            },
            startLandfill: true,
            vehicleEntries: true,
            truckDumpEntries: true,
        },
        }
      },
    });
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setContent(
      getHtml(
        bill?.id,
        bill?.createdAt,
        bill.trip.truckDumpEntries[0].timeOfArrival,
        bill.trip.truckDumpEntries[0].timeOfDeparture,
        bill.trip.truckDumpEntries[0].volumeOfWaste,
        bill.trip.vehicle.id,
        bill.trip.vehicle.registrationNumber,
        bill.trip.vehicle.type,
        bill.trip.vehicle.unloadedFuelCost,
        bill.trip.vehicle.loaddedFuelCost,
        bill.trip.vehicle.capacity,
        bill.amount,
        bill.trip.distance/1000,
        bill.trip.duration,
      ),
    );
    const pdfBuffer = await page.pdf({ format: 'A4' });

    res.contentType('application/pdf');
    res.send(pdfBuffer);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
});

router.post('/contractorBill', async (req: Request, res: Response) => {
      try {
        // get all the contractors
        const contractors = await prisma.contractor.findMany();
        // create a bill for each contractor
        contractors.forEach(async (contractor) => {
          await createContractorBill(contractor.id);
        });
        return res.status(201).json({ message: 'All Contractors bills created successfully' });
      } catch (error: any) {
        return res.status(400).json({ message: error.message });
      }
});
router.get('/contractorBill', auth.required, async (req: Request, res: Response) => {
  try {
    const bills = await prisma.contractorBill.findMany({
      include: {
        contractor: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    return res.json(bills);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
});

router.get('/contractorBill/:id', auth.required, async (req: Request, res: Response) => {
  try {
    const bill = await prisma.contractorBill.findUnique({
      where: {
        id: Number(req.params.id),
      },
      include: {
        contractor: true,
      },
    });
    return res.json(bill);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
});

router.get('/contractorBill/:id/download', async (req: Request, res: Response) => {
  try {
    // @ts-ignore
    const bill = await prisma.contractorBill.findUnique({
      where: {
        id: Number(req.params.id),
      },
      include: {
        contractor: {
          include: {
            managers: true,
          },
        },
      },
    });
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setContent(
      getHtml2(
        bill?.id,
        bill?.createdAt,
        bill.contractor.companyName,
        bill.contractor.tin,
        bill.contractor.registrationId,
        bill.baseAmount,
        bill.fine,
        bill.totalAmount,
      ),
    );
    const pdfBuffer = await page.pdf({ format: 'A4' });

    res.contentType('application/pdf');
    res.send(pdfBuffer);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
});

export default router;
