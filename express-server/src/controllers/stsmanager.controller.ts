/* eslint-disable import/newline-after-import */
/* eslint-disable import/first */
import { Request, Response, Router } from 'express';
import auth from '../utils/auth';
const router = Router();

// eslint-disable-next-line import/no-unresolved
import { createVehicleEntry } from '../services/stsmanager.service'
 
// Create a new STS
router.post('/vehicle-entry', auth.required, auth.isSTSManager, async (req: Request, res: Response) => {
  try {
    const sts = await createVehicleEntry(req.body);
    res.status(201).json(sts);
  } catch (error : any) {
    res.status(400).json({ message: error.message });
  }
});

export default router;
