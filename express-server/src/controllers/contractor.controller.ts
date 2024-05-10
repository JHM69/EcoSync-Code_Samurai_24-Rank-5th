/* eslint-disable consistent-return */
/* eslint-disable spaced-comment */
/* eslint-disable import/newline-after-import */
/* eslint-disable import/first */
// @ts-nocheck
import { Request, Response, Router } from 'express';
import prisma from '../../prisma/prisma-client';
import auth from '../utils/auth';
const router = Router();


// create new contractor
router.post('/contractor', auth.required,auth.isSystemAdmin, async (req: Request, res: Response) => {
    try {
        const {
            companyName,
            registrationId,
            registrationDate,
            tin,
            phone,
            paymentPerTonnage,
            requiredWastePerDay,
            contractStartDate,
            contractEndDate,
            areaOfCollection,
            stsId
        } = req.body;

        const newContractor = await prisma.contractor.create({
            data: {
                companyName: companyName,
                registrationId: registrationId,
                registrationDate: new Date(registrationDate),
                tin: tin,
                phone: phone,
                paymentPerTonnage: parseFloat(paymentPerTonnage),
                requiredWastePerDay: parseFloat(requiredWastePerDay),
                contractStartDate: new Date(contractStartDate),
                contractEndDate: new Date(contractEndDate),
                areaOfCollection: areaOfCollection,
                sts: {
                    connect: {
                        id: parseInt(stsId)
                    }
                }
            }
        });
        res.status(200).json(newContractor);
    } catch (error) {
        console.log(error);
        res.status(400).json({ message: error.message });
    }
});

// update contractor by id
router.put('/contractor/:id', auth.required,auth.isSystemAdmin, async (req: Request, res: Response) => {
    try {
        const {
            companyName,
            registrationId,
            registrationDate,
            tin,
            phone,
            paymentPerTonnage,
            requiredWastePerDay,
            contractStartDate,
            contractEndDate,
            areaOfCollection,
            stsId
        } = req.body;

        await prisma.contractor.update({
            where: {
                id: Number(req.params.id)
            },
            data: {
                companyName: companyName || undefined,
                registrationId: registrationId || undefined,
                registrationDate: registrationDate ? new Date(registrationDate) : undefined,
                tin: tin || undefined,
                phone: phone || undefined,
                paymentPerTonnage:  parseFloat(paymentPerTonnage) || undefined,
                requiredWastePerDay: parseFloat(requiredWastePerDay) || undefined,
                contractStartDate: contractStartDate ? new Date(contractStartDate) : undefined,
                contractEndDate: contractEndDate ? new Date(contractEndDate) : undefined,
                areaOfCollection: areaOfCollection || undefined,
            }
        });
        if(stsId){
            await prisma.contractor.update({
                where: {
                    id: Number(req.params.id)
                },
                data: {
                    sts: {
                        connect: {
                            id: parseInt(stsId)
                        }
                    }
                }
            });
        }
        const contractor = await prisma.contractor.findUnique({
            where: {
                id: Number(req.params.id)
            }
        });
        res.status(200).json(contractor);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// get all contractors
router.get('/contractor', auth.required, async (req: Request, res: Response) => {
    try {
        const contractors = await prisma.contractor.findMany(
            {
                include: {
                    managers: true,
                    employees: true,
                }
            }
        );
        res.status(200).json(contractors);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// get a contractor by id
router.get('/contractor/:id', auth.required, async (req: Request, res: Response) => {
    try {
        const contractor = await prisma.contractor.findUnique({
            where: {
                id: Number(req.params.id)
            },
            include: {
                managers: true,
                employees: true,
            }
        });
        res.status(200).json(contractor);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

router.get('/contractor2/:id', auth.required, async (req: Request, res: Response) => {
    try {
        const contractor = await prisma.contractor.findUnique({
            where: {
                id: Number(req.params.id)
            },
            include: {
                managers: true,
                employees: true,
            }
        });
        res.status(200).json(contractor);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// delete a contractor by id
router.delete('/contractor/:id', auth.required,auth.isSystemAdmin, async (req: Request, res: Response) => {
    try {
        await prisma.contractor.delete({
            where: {
                id: Number(req.params.id)
            }
        });
        res.status(200).json({ message: 'Contractor deleted successfully' });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// get contractors of a sts
router.get('/sts/:stsId/contractors', auth.required, async (req: Request, res: Response) => {
    try {
        const contractors = await prisma.contractor.findMany({
            where: {
                stsId: Number(req.params.stsId)
            }
        });
        res.status(200).json(contractors);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// get my contractors
router.get('/myContractors', auth.required, async (req: Request, res: Response) => {
    try {
        const contractors = await prisma.contractor.findMany({
            where: {
                managers: {
                    some: {
                        id: Number(req.user.id)
                    }
                }
            }
        });
        res.status(200).json(contractors);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// add a manager in a contractor
router.post('/contractor/:contractorId/manager', auth.required,auth.isSystemAdmin, async (req: Request, res: Response) => {
    try {
        const { managerId, accessLevel, phone } = req.body;
        
        await prisma.user.update({
            where: {
                id: Number(managerId)
            },
            data: {
                accessLevel: accessLevel || undefined,
                phone: phone || undefined
            }
        });

        const contractor =  await prisma.contractor.update({
            where: {
                id: Number(req.params.contractorId)
            },
            data: {
                managers: {
                    connect: {
                        id: Number(managerId)
                    }
                }
            },
            include: {
                managers: true
            }
        });
        res.status(200).json(contractor);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// remove a manager from a contractor
router.delete('/contractor/:contractorId/manager', auth.required,auth.isSystemAdmin, async (req: Request, res: Response) => {
    try {
        const { managerId } = req.body;

        const contractor = await prisma.contractor.update({
            where: {
                id: Number(req.params.contractorId)
            },
            data: {
                managers: {
                    disconnect: {
                        id: Number(managerId)
                    }
                }
            },
            include: {
                managers: true
            }
        });
        res.status(200).json(contractor);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// get managers of a contractor
router.get('/contractor/:contractorId/manager', auth.required, async (req: Request, res: Response) => {
    try {
        const managers = await prisma.user.findMany({
            where: {
                contractor: {
                    some: {
                        id: Number(req.params.contractorId)
                    }
                }
            },
            select: {
                id: true,
                email: true,
                accessLevel: true,
                phone: true,
                image: true,
                createdAt: true,
            }
        });
        res.status(200).json(managers);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// get employees of a contractor
router.get('/contractor/:contractorId/employees', auth.required, async (req: Request, res: Response) => {
    try {
        const employees = await prisma.employee.findMany({
            where: {
                contractorId: Number(req.params.contractorId)
            }
        });
        res.status(200).json(employees);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

export default router;