/* eslint-disable consistent-return */
/* eslint-disable no-shadow */
/* eslint-disable no-use-before-define */
/* eslint-disable no-return-await */
import { Request, Response, Router } from 'express';
import auth from '../utils/auth';
import prisma from '../../prisma/prisma-client';

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

const createLandfill = async (landfillData: {
  name: string;
  capacity: string;
  startTime: string;
  endTime: string;
  lat: string;
  lon: string;
  address?: string;
  managerIds?: string[];
}) => {
  const managerIds = landfillData.managerIds ? landfillData.managerIds.map(id => Number(id)) : [];
  return await prisma.landfill.create({
    data: {
      name: landfillData.name,
      capacity: Number(landfillData.capacity),
      currentWasteVolume: 0,
      startTime: landfillData.startTime,
      endTime: landfillData.endTime,
      gpsCoords: `${landfillData.lat},${landfillData.lon}`,
      lat: Number(landfillData.lat),
      lon: Number(landfillData.lon),
      address: landfillData.address,
      managers: {
        connect: managerIds.map(id => ({ id })),
      },
    },
    include: {
      managers: true,
    },
  });
};

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

const updateLandfill = async (
  landfillData: {
    name?: string;
    capacity?: string;
    currentWasteVolume?: string;
    startTime?: string;
    endTime?: string;
    lat?: string;
    lon?: string;
    address?: string;
    managerIds?: string[];
  },
  id: number,
) => {
  const managerIds = landfillData.managerIds ? landfillData.managerIds.map(id => Number(id)) : [];
  if (landfillData.managerIds) {
    await prisma.landfill.update({
      where: {
        id,
      },
      data: {
        managers: {
          set: [],
        },
      },
    });
  }

  return await prisma.landfill.update({
    where: {
      id,
    },
    data: {
      name: landfillData.name,
      capacity: Number(landfillData.capacity),
      startTime: landfillData.startTime,
      endTime: landfillData.endTime,
      gpsCoords: `${landfillData.lat},${landfillData.lon}`,
      lat: Number(landfillData.lat),
      lon: Number(landfillData.lon),
      address: landfillData.address,
      managers: {
        set: managerIds.map(id => ({ id })),
      },
    },
    include: {
      managers: true,
    },
  });
};

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

// Landfill managers can add entry of truck dumping with weight of waste, time of arrival and time of departure.
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
      // @ts-ignore
      let landfillEntry = await createLandfillEntry(req.body, landfillId, req.user.id);
      // find the latest VehicleEntry of the vehicle
      const vehicleEntry = await prisma.vehicleEntry.findFirst({
        where: {
          vehicleId: Number(req.body.vehicleId),
        },
        orderBy: {
          id: 'desc',
        },
        include: {
          bill: true,
        },
      });
      // now update the landfillENTRY with the billId
      if(vehicleEntry && vehicleEntry.landfillId === landfillId && vehicleEntry.volumeOfWaste === Number(req.body.volumeOfWaste)){
        if (vehicleEntry?.bill && vehicleEntry.bill.verified === false) {
          // @ts-ignore
          landfillEntry = await prisma.truckDumpEntry.update({
            where: {
              id: landfillEntry.id,
            },
            data: {
              billId: vehicleEntry.bill.id,
            },
          });
          // update the bill status to paid
          await prisma.bill.update({
            where: {
              id: vehicleEntry.bill.id,
            },
            data: {
              verified: true,
            },
          });
        }
      }
      res.status(201).json(landfillEntry);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  },
);

const createLandfillEntry = async (
  landfillEntryData: {
    vehicleId: string;
    volumeOfWaste: string;
    timeOfArrival: string;
    timeOfDeparture: string;
  },
  landfillId: number,
  userID: number,
) => {
  // get the vehicle
  const vehicle = await prisma.vehicle.findUnique({
    where: {
      id: Number(landfillEntryData.vehicleId),
    },
  });
  // update the remaining capacity of the vehicle
  await prisma.vehicle.update({
    where: {
      id: Number(landfillEntryData.vehicleId),
    },
    data: {
      // @ts-ignore
      remainingCapacity: vehicle?.capacity,
    },
  });
  return await prisma.truckDumpEntry.create({
    data: {
      volumeOfWaste: Number(landfillEntryData.volumeOfWaste),
      timeOfArrival: new Date(landfillEntryData.timeOfArrival),
      timeOfDeparture: new Date(landfillEntryData.timeOfDeparture),
      landfill: {
        connect: {
          id: Number(landfillId),
        },
      },
      vehicle: {
        connect: {
          id: Number(landfillEntryData.vehicleId),
        },
      },
      user: {
        connect: {
          id: Number(userID),
        },
      },
    },
    include: {
      landfill: true,
      vehicle: true,
    },
  });
};

// get all LandfillEntries
router.get('/landfills/:id/entry', auth.required, async (req: Request, res: Response) => {
  try {
    const landfillEntries = await prisma.truckDumpEntry.findMany({
      where: {
        landfillId: Number(req.params.id),
      },
      include: {
        landfill: true,
        vehicle: true,
      },
    });
    res.status(200).json(landfillEntries);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
});

export default router;
