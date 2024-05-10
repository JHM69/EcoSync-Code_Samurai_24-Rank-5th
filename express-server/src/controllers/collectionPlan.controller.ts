/* eslint-disable consistent-return */
/* eslint-disable spaced-comment */
/* eslint-disable import/newline-after-import */
/* eslint-disable import/first */
// @ts-nocheck
import { Request, Response, Router } from 'express';
import prisma from '../../prisma/prisma-client';
import auth from '../utils/auth';
const router = Router();


router.post('/collectionPlan', auth.required, async (req: Request, res: Response) => {
    try {
       const {contractorId, area, startTime, endTime, laborers, vans, expectedWaste} = req.body;
         const newCollectionPlan = await prisma.collectionPlan.create({
              data: {
                contractor: {
                     connect: {
                          id: parseInt(contractorId)
                     }
                },
                area: area,
                startTime: new Date(startTime),
                endTime: new Date(endTime),
                laborers: parseInt(laborers),
                vans: parseInt(vans),
                expectedWaste: parseFloat(expectedWaste)
              }
         });
        res.status(200).json(newCollectionPlan);
    } catch (error) {
        console.log(error);
        res.status(400).json({ message: error.message });
    }
});


// get all collection plans where completed is false
router.get('/collectionPlan', auth.required, async (req: Request, res: Response) => {
    try {
        const collectionPlans = await prisma.collectionPlan.findMany({
            where: {
                completed: false
            },
            include: {
                contractor: true
            },
            orderBy: {
                    id: 'desc'
               }
        });
        res.status(200).json(collectionPlans);
    } catch (error) {
        console.log(error);
        res.status(400).json({ message: error.message });
    }
});

// get all collection plans of a contractor where completed is false order by id desc
router.get('/collectionPlan/contractor/:contractorId', auth.required, async (req: Request, res: Response) => {
    try {
        const { contractorId } = req.params;
        const collectionPlans = await prisma.collectionPlan.findMany({
            where: {
                contractorId: parseInt(contractorId),
                completed: false
            },
            orderBy: {
                id: 'desc'
            }
        });
        res.status(200).json(collectionPlans);
    } catch (error) {
        console.log(error);
        res.status(400).json({ message: error.message });
    }
});


// mark collection plan as completed
router.get('/collectionPlan/:id/complete', auth.required, async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const collectionPlan = await prisma.collectionPlan.update({
            where: {
                id: parseInt(id)
            },
            data: {
                completed: true
            }
        });
        res.status(200).json(collectionPlan);
    } catch (error) {
        console.log(error);
        res.status(400).json({ message: error.message });
    }
});



export default router;