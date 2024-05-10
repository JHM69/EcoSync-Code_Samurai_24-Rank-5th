/* eslint-disable consistent-return */
/* eslint-disable spaced-comment */
/* eslint-disable import/newline-after-import */
/* eslint-disable import/first */
// @ts-nocheck
import { Request, Response, Router } from 'express';
import prisma from '../../prisma/prisma-client';
import auth from '../utils/auth';
const router = Router();

// create a monitor endpoint
router.get('/monitor/:contractorId', auth.required,  async (req: Request, res: Response) => {
    try {
        const {contractorId} = req.params;
        const contractor = await prisma.contractor.findUnique({
            where: {
              id: parseInt(contractorId),
            },
            include: {
              managers: {
                select: {
                  id: true,
                  lastLogin: true,
                  lastLogout: true,
                  name: true,
                  image: true,
                  accessLevel: true
                },
              },
            },
          });
        if (!contractor) {
            return res.status(404).json({ message: 'Contractor not found' });
        }
        
        let managers = contractor.managers;
        // add difference between last login and last logout
        managers = managers.map(manager => {
            const lastLogin = new Date(manager.lastLogin);
            const lastLogout = new Date(manager.lastLogout);
            const diff = Math.floor((lastLogout.getTime() - lastLogin.getTime()) / (1000 * 60));
            return {
            ...manager,
            diff
            }
        });
        res.status(200).json(managers);  
    } catch (error) {
        console.log(error);
        res.status(400).json({ message: error.message });
    }
});


export default router;