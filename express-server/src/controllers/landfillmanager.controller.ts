/* eslint-disable import/newline-after-import */
/* eslint-disable import/first */
import { Request, Response, Router } from 'express';
import auth from '../utils/auth';
const router = Router();

// eslint-disable-next-line import/no-unresolved
import {  dumpIntoLandfill } from '../services/landfillmanager.service'

// Create a new user
router.post('/users', auth.required, auth.isSystemAdmin, async (req: Request, res: Response) => {
  try {
    const user = await dumpIntoLandfill(req.body);
    res.status(201).json(user);
  } catch (error : any) {
    res.status(400).json({ message: error.message });
  }
});
