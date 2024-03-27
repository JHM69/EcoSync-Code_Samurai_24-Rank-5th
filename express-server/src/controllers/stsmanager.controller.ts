import { Request, Response, Router } from 'express';
import auth from '../utils/auth';
import prisma from '../../prisma/prisma-client';
import ts from 'typescript';

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

const createSTS = async (stsData: {
  wardNumber: string;
  capacity: string;
  lat: string;
  lon: string;
  managerIds?: string[];
  address?: string;
  logo?: string;
  vehicleIds?: string[];
}) => {
  const managerIds = stsData.managerIds ? stsData.managerIds.map(id => Number(id)) : [];
  const vehicleIds = stsData.vehicleIds ? stsData.vehicleIds.map(id => Number(id)) : []; 

  return await prisma.sTS.create({
    data: {
      wardNumber: stsData.wardNumber,
      capacity: Number(stsData.capacity),
      currentWasteVolume: 0,
      lat: Number(stsData.lat),
      lon: Number(stsData.lon),
      address: stsData.address,
      logo: stsData.logo,
      vehicles: {
        connect: vehicleIds.map(id => ({ id })), // Connect vehicles by id
      },
      managers: {
        connect: managerIds.map(id => ({ id })),
      },
    },
    include: {
      managers: true,
      vehicles: true,
    },
  });
};

// Update STS by id
router.put('/sts/:id', auth.required, auth.isSystemAdmin, async (req: Request, res: Response) => {
  try {
    const sts = await updateSTS(req.body, Number(req.params.id));
    res.status(200).json(sts);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
});

const updateSTS = async (stsData: {
  wardNumber?: string;
  capacity?: string;
  currentWasteVolume?: string;
  lat?: string;
  lon?: string;
  managerIds?: string[];
  address?: string;
  logo?: string;
  vehicleIds?: string[];
}, id: number) => {
  const managerIds = stsData.managerIds ? stsData.managerIds.map(id => Number(id)) : [];
  const vehicleIds = stsData.vehicleIds ? stsData.vehicleIds.map(id => Number(id)) : [];

  if(stsData.managerIds){
    // remove all managers
    await prisma.sTS.update({
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
  if(stsData.vehicleIds){
    // remove all vehicles
    await prisma.sTS.update({
      where: {
        id,
      },
      data: {
        vehicles: {
          set: [],
        },
      },
    });
  }

  return await prisma.sTS.update({
    where: {
      id,
    },
    data: {
      wardNumber: stsData.wardNumber,
      capacity: Number(stsData.capacity),
      currentWasteVolume: Number(stsData.currentWasteVolume),
      lat: Number(stsData.lat),
      lon: Number(stsData.lon),
      address: stsData.address,
      logo: stsData.logo,
      vehicles: {
        connect: vehicleIds.map(id => ({ id })),
      },
      managers: {
        connect: managerIds.map(id => ({ id })),
      },
    },
    include: {
      managers: true,
      vehicles: true,
    },
  });
};

// get all STS
router.get('/sts', auth.required, async (req: Request, res: Response) => {
  try {
    const sts = await prisma.sTS.findMany({
      include: {
      managers: {
        select: {
        id: true,
        name: true,
        }
      },
      vehicles: {
        select: {
        id: true,
        registrationNumber: true,
        }
      }
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
        managers: {
          select: {
          id: true,
          name: true,
          }
        },
        vehicles: {
          select: {
          id: true,
          registrationNumber: true,
          }
        }
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
router.delete('/sts/:id', auth.required, auth.isSystemAdmin, async (req: Request, res: Response) => {
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
});


// STS managers can add entry of vehicles leaving the STS with STS ID, vehicle number, weight of waste, time of arrival and time of departure.
router.post('/sts/:id/entry', auth.required,auth.isSTSManager, async (req: Request, res: Response) => {
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
    // @ts-ignore
    const vehicleEntry = await createVehicleEntry(req.body, stsId, req.user.id);
    res.status(201).json(vehicleEntry);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
});

const createVehicleEntry = async (vehicleEntryData: {
  vehicleId: string;
  volumeOfWaste: string;
  timeOfArrival: string;
  timeOfDeparture: string;
}, stsId: number, userId:number) => {
  // get the vehicle
  const vehicle = await prisma.vehicle.findUnique({
    where: {
      id: Number(vehicleEntryData.vehicleId),
    },
  });
  // update the remaining capacity of the vehicle
  await prisma.vehicle.update({
    where: {
      id: Number(vehicleEntryData.vehicleId),
    },
    data: {
      // @ts-ignore
      remainingCapacity: vehicle.remainingCapacity - Number(vehicleEntryData.volumeOfWaste),
    },
  });
  const sts = await prisma.sTS.findUnique({
    where: {
      id: stsId,
    },
  });
  // update sts currentWasteVolume
  await prisma.sTS.update({
    where: {
      id: stsId,
    },
    data: {
      // @ts-ignore
      currentWasteVolume: sts.currentWasteVolume - Number(vehicleEntryData.volumeOfWaste),
    },
  });
  
  return await prisma.vehicleEntry.create({
    data: {
      volumeOfWaste: Number(vehicleEntryData.volumeOfWaste),
      timeOfArrival: new Date(vehicleEntryData.timeOfArrival),
      timeOfDeparture: new Date(vehicleEntryData.timeOfDeparture),
      sts: {
        connect: {
          id: stsId,
        },
      },
      vehicle: {
        connect: {
          id: Number(vehicleEntryData.vehicleId),
        },
      },
      user: {
        connect: {
          id: userId,
        },
      },
    },
    include: {
      sts: true,
      vehicle: true,
    },
  });
};

// get all entries of a STS. anyone can get the entries of a STS.
router.get('/sts/:id/entry', auth.required, async (req: Request, res: Response) => {
  try {
    const stsId = Number(req.params.id);
    const entries = await prisma.vehicleEntry.findMany({
      where: {
        stsId,
      },
      include: {
        sts: true,
        vehicle: true,
      },
    });
    res.status(200).json(entries);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
});

// add waste in sts
router.post('/sts/:id/add', auth.required, auth.isSTSManager, async (req: Request, res: Response) => {
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
    const updatedSts= await prisma.sTS.update({
      where: {
        id: stsId,
      },
      data: {
        currentWasteVolume: sts.currentWasteVolume + Number(req.body.weight),
      },
    });
    res.status(200).json(updatedSts);
  }
  catch (error: any) {
    res.status(400).json({ message: error.message });
  } 
});

export default router;