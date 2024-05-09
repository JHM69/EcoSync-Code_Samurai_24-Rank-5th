/* eslint-disable consistent-return */
/* eslint-disable spaced-comment */
/* eslint-disable import/newline-after-import */
/* eslint-disable import/first */
// @ts-nocheck
import { Request, Response, Router } from 'express';
import prisma from '../../prisma/prisma-client';
import auth from '../utils/auth';
const router = Router();

// create trip plan
router.post('/tripplan', auth.required,auth.isSystemAdmin, async (req: Request, res: Response) => {
  try {
    const {driverId, vehicleId, stsList, landfillList} = req.body;
    const tripPlan = await prisma.tripPlan.create({
      data: {
        driver: {
          connect: { id: parseInt(driverId) },
        },
        vehicle: {
          connect: { id: parseInt(vehicleId) },
        },
      }
    });
    //add all sts in stsList to tripPlan
    for(const item of stsList){
      await prisma.tripPlanSts.create({
        data: {
          tripPlan: {
            connect: { id: tripPlan.id },
          },
          sts: {
            connect: { id: parseInt(item.id) },
          },
          time: new Date(item.time),
        }
      });
    }
    //add all landfills in landfillList to tripPlan
    for(const item of landfillList){
      await prisma.tripPlanLandfill.create({
        data: {
          tripPlan: {
            connect: { id: tripPlan.id },
          },
          landfill: {
            connect: { id: parseInt(item.id) },
          },
          time: new Date(item.time),
        }
      });
    }
    const updatedTripPlan = await prisma.tripPlan.findUnique({
        where: { id: tripPlan.id },
        include: {
            driver: {
            select: {
              name: true,
              email: true,
              phone: true,
              image: true,
              drivingLicense: true,
            },
        },
            vehicle: true,
            tripPlanStss: {
                include: {
                    sts: true,
                }
            },
            tripPlanLandfills: {
                include: {
                    landfill: true,
                }
            }
        },
        });
    return res.status(201).json(updatedTripPlan);
  } catch (error: any) {
    return res.status(400).json({ message: error.message });
  }
});

// update trip plan
router.put('/tripplan/:tripPlanId', auth.required,auth.isSystemAdmin, async (req: Request, res: Response) => {
  try {
    const {driverId, vehicleId, stsList, landfillList} = req.body;
    await prisma.tripPlanSts.deleteMany({
      where: {
        tripPlanId: parseInt(req.params.tripPlanId),
      },
    });
    await prisma.tripPlanLandfill.deleteMany({
      where: {
        tripPlanId: parseInt(req.params.tripPlanId),
      },
    });
    //add all sts in stsList to tripPlan
    for(const item of stsList){
      await prisma.tripPlanSts.create({
        data: {
          tripPlan: {
            connect: { id: parseInt(req.params.tripPlanId) },
          },
          sts: {
            connect: { id: parseInt(item.id) },
          },
          time: new Date(item.time),
        }
      });
    }
    //add all landfills in landfillList to tripPlan
    for(const item of landfillList){
      await prisma.tripPlanLandfill.create({
        data: {
          tripPlan: {
            connect: { id: parseInt(req.params.tripPlanId) },
          },
          landfill: {
            connect: { id: parseInt(item.id) },
          },
          time: new Date(item.time),
        }
      });
    }
    const updatedTripPlan = await prisma.tripPlan.update({
        where: { id: parseInt(req.params.tripPlanId) },
        data: {
            driver: {
              connect: { id: parseInt(driverId) },
            },
            vehicle: {
              connect: { id: parseInt(vehicleId) },
            },
        },
        include: {
            driver: {
            select: {
              name: true,
              email: true,
              phone: true,
              image: true,
              drivingLicense: true,
            },
        },
            vehicle: true,
            tripPlanStss: {
                include: {
                    sts: true,
                }
            },
            tripPlanLandfills: {
                include: {
                    landfill: true,
                }
            },
            trip: true,
        },
        });
    return res.status(201).json(updatedTripPlan);
  } catch (error: any) {
    return res.status(400).json({ message: error.message });
  }
});

// get all trip plans with limit and offset
router.get('/tripplan', auth.required, async (req: Request, res: Response) => {
    try {
        const { limit, offset } = req.query;
        const tripPlans = await prisma.tripPlan.findMany({
            include: {
                driver: {
                        select: {
                            name: true,
                            email: true,
                            phone: true,
                            image: true,
                            drivingLicense: true,
                        },
                },
                vehicle: true,
                tripPlanStss: {
                        include: {
                                sts: true,
                        }
                },
                tripPlanLandfills: {
                        include: {
                                landfill: true,
                        }
                },
                trip: true,
        },
        orderBy: {
            id: 'desc',
        },
        take: limit ? parseInt(limit.toString()) : undefined,
        skip: offset ? parseInt(offset.toString()) : undefined,
        });
        return res.json(tripPlans);
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
});

// get specific trip plan
router.get('/tripplan/:tripPlanId', auth.required, async (req: Request, res: Response) => {
  try {
    const tripPlan = await prisma.tripPlan.findUnique({
      where: { id: parseInt(req.params.tripPlanId) },
      include: {
        driver: {
            select: {
              name: true,
              email: true,
              phone: true,
              image: true,
              drivingLicense: true,
            },
        },
        vehicle: true,
        tripPlanStss: {
            include: {
                sts: true,
            }
        },
        tripPlanLandfills: {
            include: {
                landfill: true,
            }
        },
        trip: true,
    },
    });
    return res.status(201).json(tripPlan);
  } catch (error: any) {
    return res.status(400).json({ message: error.message });
  }
});

// delete trip plan
router.delete('/tripplan/:tripPlanId', auth.required,auth.isSystemAdmin, async (req: Request, res: Response) => {
  try {
    await prisma.tripPlanSts.deleteMany({
      where: {
        tripPlanId: parseInt(req.params.tripPlanId),
      },
    });
    await prisma.tripPlanLandfill.deleteMany({
      where: {
        tripPlanId: parseInt(req.params.tripPlanId),
      },
    });
    await prisma.tripPlan.delete({
      where: { id: parseInt(req.params.tripPlanId) },
    });
    return res.status(204).json({ message: 'Trip Plan deleted successfully' });
  } catch (error: any) {
    return res.status(400).json({ message: error.message });
  }
});

// get my trip plans of last 24 hours
router.get('/mytripplans', auth.required, async (req: Request, res: Response) => {
  try {
    const tripPlans = await prisma.tripPlan.findMany({
      where: {
        driverId: req.user.id,
        createdAt: {
          gte: new Date(new Date().getTime() - 24 * 60 * 60 * 1000),
        },
      },
      include: {
        vehicle: true,
        tripPlanStss: {
            include: {
                sts: true,
            }
        },
        tripPlanLandfills: {
            include: {
                landfill: true,
            }
        }
    },
    });
    return res.json(tripPlans);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
});

// sts trip plan of last 24 hours by sts id
router.get('/ststripplans/:stsId', auth.required, async (req: Request, res: Response) => {
  try {
    const tripPlans = await prisma.tripPlan.findMany({
      where: {
        tripPlanStss: {
          some: {
            stsId: parseInt(req.params.stsId),
          },
        },
        createdAt: {
          gte: new Date(new Date().getTime() - 24 * 60 * 60 * 1000),
        },
      },
      include: {
        driver: {
            select: {
              name: true,
              email: true,
              phone: true,
              image: true,
              drivingLicense: true,
            },
        },
        vehicle: true,
        tripPlanStss: {
            include: {
                sts: true,
            }
        },
        tripPlanLandfills: {
            include: {
                landfill: true,
            }
        },
        trip: true,
    },
    });
    return res.json(tripPlans);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
});

// landfills trip plan of last 24 hours by landfill id
router.get('/landfilltripplans/:landfillId', auth.required, async (req: Request, res: Response) => {
  try {
    const tripPlans = await prisma.tripPlan.findMany({
      where: {
        tripPlanLandfills: {
          some: {
            landfillId: parseInt(req.params.landfillId),
          },
        },
        createdAt: {
          gte: new Date(new Date().getTime() - 24 * 60 * 60 * 1000),
        },
      },
      include: {
        driver: {
            select: {
              name: true,
              email: true,
              phone: true,
              image: true,
              drivingLicense: true,
            },
        },
        vehicle: true,
        tripPlanStss: {
            include: {
                sts: true,
            }
        },
        tripPlanLandfills: {
            include: {
                landfill: true,
            }
        },
        trip: true,
    },
    });
    return res.json(tripPlans);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
});

// create a endpoint that mark a sts as visited
router.post('/tripplan/:id/visited', auth.required, async (req: Request, res: Response) => {
  try {
    // check is the user is the driver of the trip plan
    const tripPlan = await prisma.tripPlan.findUnique({
        where: { id: parseInt(req.params.id) },
        include: {
          vehicle: true,
        },
    });
    if(tripPlan.driverId !== req.user.id){
        return res.status(400).json({ message: 'You are not the driver of this trip plan' });
    }

     const {stsId, landfillId} = req.body;
     if(stsId){
          const tripPlanSts = await prisma.tripPlanSts.findFirst({
              where: {
                  tripPlanId: parseInt(req.params.id),
                  stsId: parseInt(stsId),
              },
          });
          if(!tripPlanSts){
              return res.status(400).json({ message: 'Sts not found in this trip plan' });
          }
          const updatedTripPlanSts = await prisma.tripPlanSts.update({
              where: {
                  id: tripPlanSts.id,
              },
              data: {
                visited: true,
                visitedAt: new Date(),
                weiqht: tripPlan.vehicle.capacity-tripPlan.vehicle.remainingCapacity,
            },
          });
          return res.json(updatedTripPlanSts);
      }
      if(landfillId){
          const tripPlanLandfill = await prisma.tripPlanLandfill.findFirst({
              where: {
                  tripPlanId: parseInt(req.params.id),
                  landfillId: parseInt(landfillId),
              },
          });
          if(!tripPlanLandfill){
              return res.status(400).json({ message: 'Landfill not found in this trip plan' });
          }
          const updatedTripPlanLandfill = await prisma.tripPlanLandfill.update({
              where: {
                  id: tripPlanLandfill.id,
              },
              data: {
                visited: true,
                visitedAt: new Date(),
                weiqht: tripPlan.vehicle.capacity-tripPlan.vehicle.remainingCapacity,
            },
          });
          return res.json(updatedTripPlanLandfill);
      }
  } catch (error: any) {
    return res.status(400).json({ message: error.message });
  }
});

export default router;