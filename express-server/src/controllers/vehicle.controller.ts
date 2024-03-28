/* eslint-disable import/newline-after-import */
/* eslint-disable import/first */
import { Request, Response, Router } from 'express';
import prisma from '../../prisma/prisma-client';
import auth from '../utils/auth';
const router = Router();

// Get all vehicles
router.get('/vehicle', auth.required, async (req: Request, res: Response) => {
  try {
    const {search} = req.query;
    const whereQuery = search ? { registrationNumber: { contains: search.toString() } } : {};
    const vehicles = await prisma.vehicle.findMany(
      {
        where: whereQuery,
      },
    );
      
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
    const {
      registrationNumber,
      type,
      capacity,
      lat,
      lon,
      isFull,
      loaddedFuelCost,
      unloadedFuelCost,
    } = req.body;

    if (capacity !== 3 && capacity !== 5 && capacity !== 7)
      return res.status(400).json({ message: 'Capacity must be 3, 5 or 7' });
    if (
      type !== 'OpenTruck' &&
      type !== 'DumpTruck' &&
      type !== 'Compactor' &&
      type !== 'ContainerCarrier'
    )
      return res
        .status(400)
        .json({ message: 'Type must be OpenTruck, DumpTruck, Compactor or ContainerCarrier' });

    // Create the vehicle in the database
    const vehicle = await prisma.vehicle.create({
      data: {
        registrationNumber,
        type,
        capacity,
        remainingCapacity: capacity,
        lat: lat || 0, // Default to 0 if lat is not provided
        lon: lon || 0, // Default to 0 if lon is not provided
        isFull: isFull || false, // Default to false if isFull is not provided
        loaddedFuelCost,
        unloadedFuelCost,
      },
    });

    return res.status(201).json(vehicle);
  } catch (error: any) {
    return res.status(400).json({ message: error.message });
  }
});

export default router;
