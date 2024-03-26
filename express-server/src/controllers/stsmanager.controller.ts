import { Request, Response, Router } from 'express';
import auth from '../utils/auth';
import prisma from '../../prisma/prisma-client';

const router = Router();

const createSTS = async (stsData: {
  wardNumber: string;
  capacity: string;
  lat: string;
  lon: string;
  managerId?: string;
}) => {
  // check if the manager exists
  if (stsData.managerId) {
    const manager = await prisma.user.findUnique({
      where: {
        id: Number(stsData.managerId),
      },
      include: {
        role: true,
      }
    });
    if (!manager) {
      throw new Error('STS Manager not found');
    }
    if (manager.role.type !== 'STSManager')
      throw new Error('Manager role type should be STS Manager');
  }
  // if the manager already manages an STS then throw an error
  const stsManager = await prisma.sTS.findFirst({
    where: {
      managerId: Number(stsData.managerId),
    },
  });
  if (stsManager) {
    throw new Error('Manager already manages an STS');
  }
  if (Number(stsData.wardNumber) < 1 || Number(stsData.wardNumber) > 54)
    throw new Error('Invalid ward number. Ward number should be between 1 and 54');

  // eslint-disable-next-line no-return-await
  return await prisma.sTS.create({
    data: {
      wardNumber: stsData.wardNumber,
      capacity: Number(stsData.capacity),
      currentWasteVolume: 0,
      lat: Number(stsData.lat),
      lon: Number(stsData.lon),
      manager: stsData.managerId ? { connect: { id: Number(stsData.managerId) } } : undefined,
    },
    include: {
      manager: true,
    },
  });
};

// get all STS
router.get('/sts', auth.required, async (req: Request, res: Response) => {
  try {
    const sts = await prisma.sTS.findMany();
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

// Create a new STS
router.post('/sts', auth.required, auth.isSystemAdmin, async (req: Request, res: Response) => {
  try {
    const sts = await createSTS(req.body);
    res.status(201).json(sts);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
});

// set sts manager
router.put(
  '/sts/:id/manager',
  auth.required,
  auth.isSystemAdmin,
  // eslint-disable-next-line consistent-return
  async (req: Request, res: Response) => {
    try {
      const manager = await prisma.user.findUnique({
        where: {
          id: Number(req.body.managerId),
        },
        include: {
          role: true,
        },
      });
      if (!manager) {
        return res.status(404).json({ message: 'Manager not found' });
      }
      const sts = await prisma.sTS.findUnique({
        where: {
          id: Number(req.params.id),
        },
      });
      if (!sts) {
        res.status(404).json({ message: 'STS not found' });
       
      }
      if (manager.role.type !== 'STSManager') {
        return res.status(400).json({ message: 'Manager role type should be STS Manager' });
      }
      const stsManager = await prisma.sTS.findFirst({
        where: {
          managerId: Number(req.body.managerId),
        },
      });
      if (stsManager) {
        return res.status(400).json({ message: 'Manager already manages an STS' });
      }
      const updatedsts = await prisma.sTS.update({
        where: {
          id: Number(req.params.id),
        },
        data: {
          manager: {
            connect: {
              id: Number(req.body.managerId),
            },
          },
        },
        include: {
          manager: true,
        },
      });
      res.status(200).json(updatedsts);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  },
);
// delete sts manager
router.delete(
  '/sts/:id/manager',
  auth.required,
  auth.isSystemAdmin,
  async (req: Request, res: Response) => {
    try {
      const sts = await prisma.sTS.findUnique({
        where: {
          id: Number(req.params.id),
        },
      });
      if (!sts) {
        res.status(404).json({ message: 'STS not found' });
        return;
      }
      const updatedsts = await prisma.sTS.update({
        where: {
          id: Number(req.params.id),
        },
        data: {
          manager: {
            disconnect: true,
          },
        },
        include: {
          manager: true,
        },
      });
      res.status(200).json(updatedsts);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  },
);

export default router;
