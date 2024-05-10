/* eslint-disable consistent-return */
/* eslint-disable spaced-comment */
/* eslint-disable import/newline-after-import */
/* eslint-disable import/first */
// @ts-nocheck
import { Request, Response, Router } from 'express';
import prisma from '../../prisma/prisma-client';
import auth from '../utils/auth';
const router = Router();

// create a employee
router.post('/employee', auth.required, auth.isContractorManager, async (req: Request, res: Response) => {
    try {
        const {contractorId, 
            name,
            dateOfBirth,
            dateOfHire,
            jobTitle,
            paymentRatePerHour,
            phone,
            assignedCollectionRoute} = req.body;

        // check if the user is the manager of the contractor
        const contractor = await prisma.contractor.findUnique({
            where: {
              id: parseInt(contractorId),
            },
            include: {
              managers: {
                select: {
                  id: true,
                },
              },
            },
          });
          if (!contractor) {
            return res.status(404).json({ message: 'Contractor not found' });
          }
          // @ts-ignore
          const isManager = contractor.managers.some(manager => manager.id === req.user.id);
          if (!isManager) {
            return res.status(403).json({ message: 'You are not a manager of this Contractor' });
          }


        const newEmployee = await prisma.employee.create({
            data: {
                contractor: {
                    connect: {
                        id: parseInt(contractorId)
                    }
                },
                name: name,
                dateOfBirth: new Date(dateOfBirth),
                dateOfHire: new Date(dateOfHire),
                jobTitle: jobTitle,
                paymentRatePerHour: parseFloat(paymentRatePerHour),
                phone: phone,
                assignedCollectionRoute: assignedCollectionRoute
            }
        });
        return res.status(200).json(newEmployee);
    } catch (error) {
        res.status(400).json({ error: 'Something went wrong' });
    }
});

// update employee by id
router.put('/employee/:id', auth.required, auth.isContractorManager, async (req: Request, res: Response) => {
    try {
        const {
            contractorId, 
            name,
            dateOfBirth,
            dateOfHire,
            jobTitle,
            paymentRatePerHour,
            phone,
            assignedCollectionRoute} = req.body;

            const oldEmployee = await prisma.employee.findUnique({
                where: {
                  id: parseInt(req.params.id),
                },
                include: {
                  contractor: {
                   include:{
                    managers: {
                        select: {
                            id: true,
                        },
                    },
                   }
                  }
                },
              });
          const isManager = oldEmployee.contractor.managers.some(manager => manager.id === req.user.id);
          if (!isManager) {
            return res.status(403).json({ message: 'You are not a manager of this Contractor' });
          }
            
        const employee = await prisma.employee.update({
            where: {
                id: Number(req.params.id),
            },
            data: {
                contractor: {
                    connect: {
                        id: parseInt(contractorId)
                    }
                },
                name: name,
                dateOfBirth: new Date(dateOfBirth),
                dateOfHire: new Date(dateOfHire),
                jobTitle: jobTitle,
                paymentRatePerHour: parseFloat(paymentRatePerHour),
                phone: phone,
                assignedCollectionRoute: assignedCollectionRoute
            }
        });
        return res.json(employee);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// get all employees
router.get('/employee', auth.required, async (req: Request, res: Response) => {
    try {
        const employees = await prisma.employee.findMany({
            include: {
                contractor: true
            }
        });
        return res.json(employees);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// get employee by id
router.get('/employee/:id', auth.required, async (req: Request, res: Response) => {
    try {
        const employee = await prisma.employee.findUnique({
            where: {
                id: Number(req.params.id),
            },
            include: {
                contractor: true
            }
        });
        return res.json(employee);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// delete employee by id
router.delete('/employee/:id', auth.required, auth.isContractorManager, async (req: Request, res: Response) => {
    try {
        const employee = await prisma.employee.findUnique({
            where: {
              id: parseInt(req.params.id),
            },
            include: {
              contractor: {
                managers: {
                    select: {
                        id: true,
                    },
                },
              }
            },
          });
        const isManager = employee.contractor.managers.some(manager => manager.id === req.user.id);
        if (!isManager) {
          return res.status(403).json({ message: 'You are not a manager of this Contractor' });
        }
        
        await prisma.employee.delete({
            where: {
                id: Number(req.params.id),
            },
        });
        return res.json({ message: 'Employee deleted successfully' });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

export default router;