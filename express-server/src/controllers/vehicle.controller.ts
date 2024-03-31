/* eslint-disable import/newline-after-import */
/* eslint-disable import/first */
import { Request, Response, Router } from 'express';
import prisma from '../../prisma/prisma-client';
import auth from '../utils/auth';
const router = Router();

// Get all vehicles
router.get('/vehicle', auth.required, async (req: Request, res: Response) => {
  try {
    const { search } = req.query;
    const whereQuery = search
      ? { registrationNumber: { contains: search.toString(), mode: 'insensitive' } }
      : {};
    const vehicles = await prisma.vehicle.findMany({
      where: whereQuery,
    });

    return res.json(vehicles);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
});

//get all free vehicles
router.get('/freevehicle', auth.required, async (req: Request, res: Response) => {
  try {
    const { search } = req.query;
    const whereQuery = search
      ? { registrationNumber: { contains: search.toString(), mode: 'insensitive' }, stsId: null }
      : { stsId: null };
    const vehicles = await prisma.vehicle.findMany({
      where: whereQuery,
    });

    return res.json(vehicles);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
});

//get sts vehicle
router.get('/stsvehicle/:id', auth.required, async (req: Request, res: Response) => {
  try {
    const { search } = req.query;
    const { id } = req.params;
    const whereQuery = search
      ? {
          registrationNumber: { contains: search.toString(), mode: 'insensitive' },
          stsId: Number(id),
        }
      : { stsId: Number(id) };
    const vehicles = await prisma.vehicle.findMany({
      where: whereQuery,
    });

    return res.json(vehicles);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
});

// Get vehicle by id
router.get('/vehicle/:id', auth.required, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const vehicle = await prisma.vehicle.findUnique({
      where: {
        id: parseInt(id),
      },
    });
    if (!vehicle) {
      return res.status(404).json({ message: 'Vehicle not found' });
    }
    return res.json(vehicle);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
});

// Create a new vehicle
router.post('/vehicle', auth.required, auth.isSystemAdmin, async (req: Request, res: Response) => {
  try {
    // Extract vehicle data from request body
    const { registrationNumber, type, lat, lon, isFull, loaddedFuelCost, unloadedFuelCost } =
      req.body;

    // if (capacity !== 3 && capacity !== 5 && capacity !== 7)
    //   return res.status(400).json({ message: 'Capacity must be 3, 5 or 7' });
    if (
      type !== 'OpenTruck' &&
      type !== 'DumpTruck' &&
      type !== 'Compactor' &&
      type !== 'ContainerCarrier'
    )
      return res
        .status(400)
        .json({ message: 'Type must be OpenTruck, DumpTruck, Compactor or ContainerCarrier' });

    let capacity = 3;
    if (type === 'OpenTruck') {
      capacity = 3;
    } else if (type === 'DumpTruck') {
      capacity = 5;
    } else if (type === 'Compactor') {
      capacity = 7;
    } else if (type === 'ContainerCarrier') {
      capacity = 15;
    }
    // Create the vehicle in the database
    const vehicle = await prisma.vehicle.create({
      data: {
        registrationNumber,
        type,
        capacity,
        remainingCapacity: capacity,
        lat: lat || 23.79283131212387, // Default to 0 if lat is not provided
        lon: lon || 90.33052007665539, // Default to 0 if lon is not provided
        isFull: isFull || false, // Default to false if isFull is not provided
        loaddedFuelCost: Number(loaddedFuelCost) || 23.815485092033324, // Default to 0 if loaddedFuelCost is not provided
        unloadedFuelCost: Number(unloadedFuelCost) || 90.36613393405976, // Default to 0 if unloadedFuelCost is not provided
      },
    });

    return res.status(201).json(vehicle);
  } catch (error: any) {
    return res.status(400).json({ message: error.message });
  }
});

// Update vehicle by id
router.put(
  '/vehicle/:id',
  auth.required,
  auth.isSystemAdmin,
  async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { registrationNumber, type, lat, lon, isFull, loaddedFuelCost, unloadedFuelCost } =
        req.body;

      // if (capacity !== 3 && capacity !== 5 && capacity !== 7)
      //   return res.status(400).json({ message: 'Capacity must be 3, 5 or 7' });
      if (
        type !== 'OpenTruck' &&
        type !== 'DumpTruck' &&
        type !== 'Compactor' &&
        type !== 'ContainerCarrier'
      )
        return res
          .status(400)
          .json({ message: 'Type must be OpenTruck, DumpTruck, Compactor or ContainerCarrier' });

      let capacity = 3;
      if (type === 'OpenTruck') {
        capacity = 3;
      } else if (type === 'DumpTruck') {
        capacity = 5;
      } else if (type === 'Compactor') {
        capacity = 7;
      } else if (type === 'ContainerCarrier') {
        capacity = 15;
      }
      let loaddedFuelCostNumber, unloadedFuelCostNumber;
      if (loaddedFuelCost) {
        loaddedFuelCostNumber = Number(loaddedFuelCost);
      }
      if (unloadedFuelCost) {
        unloadedFuelCostNumber = Number(unloadedFuelCost);
      }
      const vehicle = await prisma.vehicle.update({
        where: {
          id: parseInt(id),
        },
        data: {
          registrationNumber,
          type,
          capacity,
          lat, // Default to 0 if lat is not provided
          lon, // Default to 0 if lon is not provided
          isFull, // Default to false if isFull is not provided
          loaddedFuelCost: loaddedFuelCostNumber, // Default to 0 if loaddedFuelCost is not provided
          unloadedFuelCost: unloadedFuelCostNumber, // Default to 0 if unloadedFuelCost is not provided
        },
      });

      return res.json(vehicle);
    } catch (error: any) {
      return res.status(400).json({ message: error.message });
    }
  },
);

// Delete vehicle by id
router.delete(
  '/vehicle/:id',
  auth.required,
  auth.isSystemAdmin,
  async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      await prisma.vehicle.delete({
        where: {
          id: parseInt(id),
        },
      });
      return res.json({ message: 'Vehicle deleted' });
    } catch (error: any) {
      return res.status(400).json({ message: error.message });
    }
  },
);

export default router;
