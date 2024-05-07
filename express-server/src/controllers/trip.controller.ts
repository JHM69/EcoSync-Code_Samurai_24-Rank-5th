/* eslint-disable consistent-return */
/* eslint-disable spaced-comment */
/* eslint-disable import/newline-after-import */
/* eslint-disable import/first */
// @ts-nocheck
import { Request, Response, Router } from 'express';
import prisma from '../../prisma/prisma-client';
import auth from '../utils/auth';
const router = Router();


// create trip
router.post('/trip', auth.required, async (req: Request, res: Response) => {
  try {
    // Extract trip data from request body
    const {vehicleId, startLandfillId} = req.body;

    // check if the vehicle's drivers array includes the current user id
    const vehicle = await prisma.vehicle.findUnique({
      where: { id: parseInt(vehicleId) },
      include: { drivers: true },
    });

    if (!vehicle) {
      return res.status(404).json({ message: 'Vehicle not found' });
    }

    if (!vehicle.drivers.some((driver) => driver.id === req.user.id)) {
      return res.status(403).json({ message: 'You are not allowed to drive this vehicle' });
    }

    // Create the trip in the database
    const trip = await prisma.trip.create({
      data: {
        startLandfill: {
            connect: { id: parseInt(startLandfillId) },
        },
        vehicle: {
          connect: { id: parseInt(vehicleId) },
        },
        driver: {
          connect: { id: req.user.id },
        },
      },
      include: {
        vehicle: true,
        driver: true,
        startLandfill: true,
      },
    });

    return res.status(201).json(trip);
  } catch (error: any) {
    return res.status(400).json({ message: error.message });
  }
});

//vehicle meta data update
router.post('/meta', auth.required, async (req: Request, res: Response) => {
  try {
    // get the latest trip of the driver
    const trip = await prisma.trip.findFirst({
      where: { driverId: req.user.id },
      orderBy: { createdAt: 'desc' },
      include: {
        vehicle: true,
      }
    });

    if (!trip) {
      return res.status(404).json({ message: 'Trip not found' });
    }

    // get lat,lon, weight from request body and parse them to float
    const { lat, lon} = req.body;
    const latFloat = parseFloat(lat);
    const lonFloat = parseFloat(lon);

    const weightFloat = Math.abs(parseFloat(trip.vehicle.capacity - trip.vehicle.remainingCapacity));

    // update the vehicle lat lon
    await prisma.vehicle.update({
        where: { id: trip.vehicle.id },
        data: {
          lat: latFloat,
          lon: lonFloat,
        },
      });
      
    // create a entry in VehicleMeta
    const vehicleMeta = await prisma.vehicleMeta.create({
      data: {
        lat: latFloat,
        lon: lonFloat,
        weight: weightFloat,
        trip: {
          connect: { id: trip.id },
        }
      },
      include: {
        trip:{
            include:{
                vehicle:true,
                vehicleEntries:true,
                vehicleMetas:true,
            }
        }
      },
    });

    return res.status(201).json(vehicleMeta);
  } catch (error: any) {
    return res.status(400).json({ message: error.message });
  }
});

// get all trips
router.get('/trip', auth.required, async (req: Request, res: Response) => {
  try {
    const trips = await prisma.trip.findMany({
      include: {
        vehicle: true,
        driver: true,
        startLandfill: true,
        vehicleEntries: true,
        vehicleMetas: true,
        truckDumpEntries: true,
        bill: true,
      },
    });

    return res.status(200).json(trips);
  } catch (error: any) {
    return res.status(400).json({ message: error.message });
  }
});

// get specific trip
router.get('/trip/:tripId', auth.required, async (req: Request, res: Response) => {
  try {
    const trip = await prisma.trip.findUnique({
      where: { id: parseInt(req.params.tripId) },
      include: {
        vehicle: true,
        driver: true,
        startLandfill: true,
        vehicleEntries: true,
        vehicleMetas: true,
        truckDumpEntries: true,
        bill: true,
      },
    });

    if (!trip) {
      return res.status(404).json({ message: 'Trip not found' });
    }

    return res.status(200).json(trip);
  } catch (error: any) {
    return res.status(400).json({ message: error.message });
  }
});

// get my trips in descending order. add limit and offset to query params to get paginated results
router.get('/mytrips', auth.required, async (req: Request, res: Response) => {
  try {
    const { limit, offset } = req.query;
    const trips = await prisma.trip.findMany({
      where: { driverId: req.user.id },
      include: {
        vehicle: true,
        driver: true,
        startLandfill: true,
        vehicleEntries: true,
        vehicleMetas: true,
        truckDumpEntries: true,
        bill: true,
      },
      orderBy: { createdAt: 'desc' },
      take: limit ? parseInt(limit.toString()) : undefined,
      skip: offset ? parseInt(offset.toString()) : undefined,
    });

    return res.status(200).json(trips);
  } catch (error: any) {
    return res.status(400).json({ message: error.message });
  }
});

// alls trips from a specific landfill in descending order. add limit and offset to query params to get paginated results
router.get('/landfilltrips/:landfillId', auth.required, async (req: Request, res: Response) => {
  try {
    const { limit, offset } = req.query;
    const trips = await prisma.trip.findMany({
      where: { startLandfillId: parseInt(req.params.landfillId) },
      include: {
        vehicle: true,
        driver: true,
        startLandfill: true,
        vehicleEntries: true,
        vehicleMetas: true,
        truckDumpEntries: true,
        bill: true,
      },
      orderBy: { createdAt: 'desc' },
      take: limit ? parseInt(limit.toString()) : undefined,
      skip: offset ? parseInt(offset.toString()) : undefined,
    });

    return res.status(200).json(trips);
  } catch (error: any) {
    return res.status(400).json({ message: error.message });
  }
});


export default router;
