/* eslint-disable consistent-return */
/* eslint-disable no-shadow */
/* eslint-disable no-use-before-define */
/* eslint-disable no-return-await */
import { Request, Response, Router } from 'express';
import auth from '../utils/auth';
import prisma from '../../prisma/prisma-client';
import { createLandfill , updateLandfill} from '../services/landfillmanager.service';
import { createBill } from '../services/billing.service';

const router = Router();

// Create a new Landfill
router.post(
  '/landfills',
  auth.required,
  auth.isSystemAdmin,
  async (req: Request, res: Response) => {
    try {
      const landfill = await createLandfill(req.body);
      res.status(201).json(landfill);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  },
);

// get all landfillmanagers
router.get('/landfillmanagers', auth.required, async (req: Request, res: Response) => {
  try {
    const search = req.query.search ? String(req.query.search) : '';
    const landfillManagers = await prisma.user.findMany({
      where: {
        roleId: 3,
        OR: [
          {
            name: {
              contains: search,
              mode: 'insensitive',
            },
          },
          {
            email: {
              contains: search,
              mode: 'insensitive',
            },
          },
        ],
      },
    });
    res.status(200).json(landfillManagers);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
});

// Update Landfill by id
router.put(
  '/landfills/:id',
  auth.required,
  auth.isSystemAdmin,
  async (req: Request, res: Response) => {
    try {
      const landfill = await updateLandfill(req.body, Number(req.params.id));
      res.status(200).json(landfill);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  },
);

// get all Landfills
router.get('/landfills', auth.required, async (req: Request, res: Response) => {
  try {
    const landfills = await prisma.landfill.findMany({
      include: {
        managers: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
    res.status(200).json(landfills);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
});

router.get(
  '/mylandfills',
  auth.required,
  auth.isLandfillManager,
  async (req: Request, res: Response) => {
    try {
      const landfills = await prisma.landfill.findMany({
        where: {
          managers: {
            some: {
              id: req.user.id,
            },
          },
        },
        include: {
          managers: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });
      res.status(200).json(landfills);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  },
);

// get Landfill by id
router.get('/landfills/:id', auth.required, async (req: Request, res: Response) => {
  try {
    const landfill = await prisma.landfill.findUnique({
      where: {
        id: Number(req.params.id),
      },
      include: {
        managers: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
    if (!landfill) {
      res.status(404).json({ message: 'Landfill not found' });
      return;
    }
    res.status(200).json(landfill);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
});

// delete Landfill by id
router.delete('/landfills/:id', auth.required, async (req: Request, res: Response) => {
  try {
    await prisma.landfill.delete({
      where: {
        id: Number(req.params.id),
      },
    });
    res.status(200).json({ message: 'Landfill deleted' });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
});

// Create a new LandfillEntry
router.post(
  '/landfills/:id/entry',
  auth.required,
  auth.isLandfillManager,
  async (req: Request, res: Response) => {
    try {
      const landfillId = Number(req.params.id);
      // check if user is manager of the landfill
      const landfill = await prisma.landfill.findFirst({
        where: {
          id: landfillId,
          managers: {
            some: {
              // @ts-ignore
              id: req.user.id,
            },
          },
        },
      });
      if (!landfill) {
        return res
          .status(403)
          .json({ message: 'You are not authorized to add entry to this landfill' });
      }
      const { tripId, volumeOfWaste, timeOfArrival, timeOfDeparture } = req.body;
      const trip = await prisma.trip.findUnique({
        where: {
          id: Number(tripId),
        },
        include: {
          vehicle: true,
        },
      });

      if (!trip) {
        return res.status(404).json({ message: 'Trip not found' });
      }
      if(trip.completed){
        return res.status(400).json({ message: 'Trip already completed' });
      }

      // update landfill current waste volume
      await prisma.landfill.update({
        where: {
          id: landfillId,
        },
        data: {
          currentWasteVolume: {
            increment: Number(volumeOfWaste),
          },
        },
      });

      // update vehicle remaining capacity
      await prisma.vehicle.update({
        where: {
          id: trip.vehicleId,
        },
        data: {
          remainingCapacity: {
            increment: Number(volumeOfWaste),
          },
        },
      });

      // mark the trip as completed
      await prisma.trip.update({
        where: {
          id: Number(tripId),
        },
        data: {
          completed: true,
        },
      });

      // create bill
      const bill = await createBill(tripId)

      const landfillEntry = await prisma.truckDumpEntry.create({
        data: {
          volumeOfWaste: Number(volumeOfWaste),
          timeOfArrival: new Date(timeOfArrival),
          timeOfDeparture: new Date(timeOfDeparture),
          trip: {
            connect: {
              id: Number(tripId),
            },
          },
          landfill: {
            connect: {
              id: landfillId,
            },
          },
          user: {
            connect: {
              id: req.user.id,
            },
          },
        },
        include: {
          landfill: true,
          trip:{
            include:{
              vehicle:true,
              startLandfill:true,
              vehicleEntries:{
                include:{
                  sts:true,
                  user:{
                    select:{
                      id:true,
                      name:true,
                      email:true,
                      phone:true,
                      image:true,
                    }
                  }
                }
              },
              truckDumpEntries:true,
              bill:true,
            }
          }
        },
      });
      res.status(201).json(landfillEntry);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  },
);

// get all LandfillEntries
router.get('/landfills/:id/entry', auth.required, async (req: Request, res: Response) => {
  try {
    const landfillEntries = await prisma.truckDumpEntry.findMany({
      where: {
        landfillId: Number(req.params.id),
      },
      include: {
        landfill: true,
        trip:{
          include:{
            vehicle:true,
            startLandfill:true,
            vehicleEntries:{
              include:{
                sts:true,
                user:{
                  select:{
                    id:true,
                    name:true,
                    email:true,
                    phone:true,
                    image:true,
                  }
                }
              }
            },
            truckDumpEntries:true,
            bill:true,
          }
        }
      },
    });
    res.status(200).json(landfillEntries);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
});

export default router;
