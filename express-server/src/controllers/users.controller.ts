/* eslint-disable import/newline-after-import */
/* eslint-disable import/first */
import { NextFunction, Request, Response, Router } from 'express';
import auth from '../utils/auth';
import * as authService from '../services/auth.service';

const router = Router();

// eslint-disable-next-line import/no-unresolved
import {
  createUser,
  getUser,
  assignUserRole,
  listUsers,
  listRoles,
  updateUser,
  deleteUser,
  getProfile,
  updateProfile,
} from '../services/user.service';
import HttpException from '../models/http-exception.model';

// Create a new user
router.post('/users', auth.required, auth.isSystemAdmin, async (req: Request, res: Response) => {
  try {
    const user = await createUser(req.body.userId, req.body.name, req.body.image,req.body.phone,req.body.drivingLicense);
    res.status(201).json(user);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
});

// List all users
router.get('/users', auth.required, auth.isSystemAdmin, async (req: Request, res: Response) => {
  try {
    
    const users = await listUsers(req?.query?.search as string);
    res.status(200).json(users);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
});

// List all roles
router.get('/users/roles', auth.required, async (req: Request, res: Response) => {
  try {
    const roles = await listRoles();
    res.status(200).json(roles);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
});

// Get a specific user
router.get('/users/:userId', auth.required, async (req: Request, res: Response) => {
  try {
    const user = await getUser(req.params.userId);
    res.status(200).json(user);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
});

// update user 
router.put('/users/:userId', auth.required, auth.isSystemAdmin, async (req: Request, res: Response) => {
  try {
    const user = await updateUser(req, Number(req.params.userId), req.body.name, req.body.image, req.body.roleId, req.body.phone, req.body.drivingLicense);
    res.status(200).json(user);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
});

// delete user
router.delete(
  '/users/:userId',
  auth.required,
  auth.isSystemAdmin,
  async (req: Request, res: Response) => {
    try {
      const user = await deleteUser(Number(req.params.userId));
      res.status(200).json({ message: 'User deleted successfully', user });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  },
);

// Assign a role to a user
router.put(
  '/users/:userId/roles',
  auth.required,
  auth.isSystemAdmin,
  async (req: Request, res: Response) => {
    try {
      const updatedUser = await assignUserRole(req.params.userId, req.body.roleId);
      res.status(200).json(updatedUser);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  },
);

// Get profile
router.get('/profile', auth.required, async (req: Request, res: Response) => {
  try {
    const user = await getProfile(String(req.user?.id));
    // eslint-disable-next-line no-console
    console.log(user);
    res.status(200).json(user);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
});

// update profile
router.put('/profile', auth.required, async (req: Request, res: Response) => {
  try {
    if (!req.user?.id) throw new HttpException(400, 'Invalid token');
    const user = await updateProfile(req.user.id, req.body.name, req.body.image, req.body.phone, req.body.drivingLicense);
    res.status(200).json(user);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
});




router.post('/user/add-face-data', auth.required ,async (req: Request, res: Response, next: NextFunction) => {
  console.log("add-face-data");
  try {
    console.log("add-face-data"+ req.body.faceData);
    const {faceData } = req.body;
    const {user} = req;
    await authService.addFaceData(user.id, faceData);
    res.status(200).json({ message: 'Error Adding Face' });
  } catch (error) {
    next(error);
  }
});


router.get('/user/face-auth',async (req: Request, res: Response, next: NextFunction) => {
  try {
    
    console.log("face-auth");
    const {user} = req;
    const faceData = await authService.getFaceData(user.id);
    res.status(200).json(faceData);
  } catch (error) {
    next(error);
  }
});
 

export default router;
