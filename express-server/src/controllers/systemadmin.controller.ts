/* eslint-disable import/newline-after-import */
/* eslint-disable import/first */
import { Request, Response, Router } from 'express';
import auth from '../utils/auth';
const router = Router();

// eslint-disable-next-line import/no-unresolved
import { createUser, assignUserRole, listUsers, createRole, listRoles, createPermission, listPermissions, createVehicle, createSTS } from '../services/systemadmin.service'

// Create a new user
router.post('/users', auth.required, auth.isSystemAdmin, async (req: Request, res: Response) => {
  try {
    const user = await createUser(req.body);
    res.status(201).json(user);
  } catch (error : any) {
    res.status(400).json({ message: error.message });
  }
});

// Assign a role to a user
router.put('/users/:userId/roles/:roleId', auth.required, auth.isSystemAdmin, async (req: Request, res: Response) => {
  try {
    const updatedUser = await assignUserRole((req.params.userId), (req.params.roleId));
    res.json(updatedUser);
  } catch (error : any) {
    res.status(400).json({ message: error.message });
  }
});

// List all users
router.get('/users', auth.required, auth.isSystemAdmin, async (req: Request, res: Response) => {
  try {
    const users = await listUsers();
    res.json(users);
  } catch (error : any) {
    res.status(400).json({ message: error.message });
  }
});

// Create a new role
router.post('/roles', auth.required, auth.isSystemAdmin, async (req: Request, res: Response) => {
  try {
    const role = await createRole(req.body);
    res.status(201).json(role);
  } catch (error : any) {
    res.status(400).json({ message: error.message });
  }
});

// List all roles
router.get('/roles', auth.required, auth.isSystemAdmin, async (req: Request, res: Response) => {
  try {
    const roles = await listRoles();
    res.json(roles);
  } catch (error : any) {
    res.status(400).json({ message: error.message });
  }
});

// Create a new permission
router.post('/rbac/permissions', auth.required, auth.isSystemAdmin, async (req: Request, res: Response) => {
  try {
    const permission = await createPermission(req.body);
    res.status(201).json(permission);
  } catch (error : any) {
    res.status(400).json({ message: error.message });
  }
});

// List all permissions
router.get('/rbac/permissions', auth.required, auth.isSystemAdmin, async (req: Request, res: Response) => {
  try {
    const permissions = await listPermissions();
    res.json(permissions);
  } catch (error : any) {
    res.status(400).json({ message: error.message });
  }
});


// Create a new vehicle
router.post('/vehicles', auth.required, auth.isSystemAdmin, async (req: Request, res: Response) => {
  try {
    const vehicle = await createVehicle(req.body);
    res.status(201).json(vehicle);
  } catch (error : any) {
    res.status(400).json({ message: error.message });
  }
});

// Create a new STS
router.post('/sts', auth.required, auth.isSystemAdmin, async (req: Request, res: Response) => {
  try {
    const sts = await createSTS(req.body);
    res.status(201).json(sts);
  } catch (error : any) {
    res.status(400).json({ message: error.message });
  }
});

export default router;
