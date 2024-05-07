/* eslint-disable no-console */
/* eslint-disable consistent-return */
/* eslint-disable no-shadow */
/* eslint-disable no-use-before-define */
/* eslint-disable no-return-await */
import { Request, Response, Router } from 'express';
 
import auth from '../utils/auth';
import prisma from '../../prisma/prisma-client';
import { createSTS, updateSTS } from '../services/stsmanager.service';

const router = Router();

// Create a new STS
router.post('/sts', auth.required, auth.isSystemAdmin, async (req: Request, res: Response) => {
  try {
    const sts = await createSTS(req.body);
    res.status(201).json(sts);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
});

// Update STS by id
router.put('/sts/:id', auth.required, auth.isSystemAdmin, async (req: Request, res: Response) => {
  try {
    const sts = await updateSTS(req.body, Number(req.params.id));
    res.status(200).json(sts);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
});

// get all stsmangers
router.get('/stsmanagers', auth.required, async (req: Request, res: Response) => {
  try {
    const search = req.query.search ? String(req.query.search) : '';
    const stsManagers = await prisma.user.findMany({
      where: {
        roleId: 2,
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
    res.status(200).json(stsManagers);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
});

// get all STS
router.get('/sts', auth.required, async (req: Request, res: Response) => {
  try {
    const sts = await prisma.sTS.findMany({
      include: {
        managers: {
          select: {
            id: true,
            name: true,
          },
        },
        vehicles: {
          select: {
            id: true,
            registrationNumber: true,
          },
        },
      },
    });
    res.status(200).json(sts);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
});

// get STS by id
router.get('/sts/:id', auth.required, async (req: Request, res: Response) => {
  try {
    const sts = await prisma.sTS.findUnique({
      where: {
        id: Number(req.params.id),
      },
      include: {
        managers: true,
        vehicles: true,
      },
    });
    if (!sts) {
      res.status(404).json({ message: 'STS not found' });
      return;
    }
    res.status(200).json(sts);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
});

// delete STS by id
router.delete(
  '/sts/:id',
  auth.required,
  auth.isSystemAdmin,
  async (req: Request, res: Response) => {
    try {
      await prisma.sTS.delete({
        where: {
          id: Number(req.params.id),
        },
      });
      res.status(200).json({ message: 'STS deleted' });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  },
);

router.get('/mysts', auth.required, async (req: Request, res: Response) => {
  try {
    const sts = await prisma.sTS.findMany({
      where: {
        managers: {
          some: {
            id: req.user.id,
          },
        },
      },
    });
    res.status(200).json(sts);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
});

// create vehicle entry
router.post('/sts/:id/entry', auth.required, auth.isSTSManager, async (req: Request, res: Response) => {
    try {
      const stsId = Number(req.params.id);
      // check if the user is a manager of the STS
      const sts = await prisma.sTS.findUnique({
        where: {
          id: stsId,
        },
        include: {
          managers: {
            select: {
              id: true,
            },
          },
        },
      });
      if (!sts) {
        return res.status(404).json({ message: 'STS not found' });
      }
      // @ts-ignore
      const isManager = sts.managers.some(manager => manager.id === req.user.id);
      if (!isManager) {
        return res.status(403).json({ message: 'You are not a manager of this STS' });
      }

      const {tripId, volumeOfWaste, timeOfArrival, timeOfDeparture} = req.body;
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

      // update the sts current waste volume
      await prisma.sTS.update({
        where: {
          id: stsId,
        },
        data: {
          currentWasteVolume: sts.currentWasteVolume - Number(volumeOfWaste),
        },
      });

      // update the remaining capacity of the vehicle
      await prisma.vehicle.update({
        where: {
          id: trip.vehicle.id,
        },
        data: {
          remainingCapacity: trip.vehicle.remainingCapacity - Number(volumeOfWaste),
        },
      });

      // create a vehicle entry
      const vehicleEntry = await prisma.vehicleEntry.create({
        data: {
          volumeOfWaste: Number(volumeOfWaste),
          timeOfArrival: new Date(timeOfArrival),
          timeOfDeparture: new Date(timeOfDeparture),
          trip: {
            connect: {
              id: Number(tripId),
            },
          },
          sts: {
            connect: {
              id: stsId,
            },
          },
          user: {
            connect: {
              id: req.user.id,
            },
          },
        },
        include: {
          sts: true,
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
              }
            }
          }
        },
      });

      return res.status(201).json(vehicleEntry);
      
    } catch (error: any) {
      console.log(error);
      res.status(400).json({ message: error.message });
    }
  },
);

// get all entries of a STS.
router.get('/sts/:id/entry', auth.required, async (req: Request, res: Response) => {
  try {
    const stsId = Number(req.params.id);
    const entries = await prisma.vehicleEntry.findMany({
      where: {
        stsId,
      },
      include: {
        sts: true,
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
            }
          }
        }
      },
    });
    res.status(200).json(entries);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
});

router.get('/sts/:id/add', auth.required, async (req: Request, res: Response) => {
  try {
    const stsId = Number(req.params.id);
    const entries = await prisma.wasteEntry.findMany({
      where: {
        stsId,
      },
      include: {
        sts: true,
      },
    });
    res.status(200).json(entries);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
});

// add waste in sts
router.post(
  '/sts/:id/add',
  auth.required,
  auth.isSTSManager,
  async (req: Request, res: Response) => {
    try {
      const stsId = Number(req.params.id);
      // check if the user is a manager of the STS
      const sts = await prisma.sTS.findUnique({
        where: {
          id: stsId,
        },
        include: {
          managers: {
            select: {
              id: true,
            },
          },
        },
      });
      if (!sts) {
        return res.status(404).json({ message: 'STS not found' });
      }
      // @ts-ignore
      const isManager = sts.managers.some(manager => manager.id === req.user.id);
      if (!isManager) {
        return res.status(403).json({ message: 'You are not a manager of this STS' });
      }

      // update the sts current waste volume
      await prisma.sTS.update({
        where: {
          id: stsId,
        },
        data: {
          currentWasteVolume: sts.currentWasteVolume + Number(req.body.weight),
        },
      });

      const wasteEntry = await prisma.wasteEntry.create({
        data: {
          volumeOfWaste: Number(req.body.weight),
          timeOfArrival: new Date(),
          sts: {
            connect: {
              id: stsId,
            },
          },
          user: {
            connect: {
              id: req.user.id,
            },
          },
        },
        include: {
          sts: true,
        },
      });

      res.status(201).json(wasteEntry);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  },
);

export default router;
