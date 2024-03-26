/* eslint-disable import/newline-after-import */
/* eslint-disable import/first */
import { Request, Response, Router } from 'express';
import auth from '../utils/auth';
const router = Router();

import { listRoles, listPermissions } from '../services/user.service';
import { connectRoleAndPermissions } from '../services/rbac.service';
import HttpException from '../models/http-exception.model';

// get all roles
router.get(
  '/rbac/roles',
  auth.required,
  auth.isSystemAdmin,
  async (req: Request, res: Response) => {
    try {
      const roles = await listRoles();
      res.status(200).json(roles);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  },
);
// get all permissions from permission table
router.get(
  '/rbac/permissions',
  auth.required,
  auth.isSystemAdmin,
  async (req: Request, res: Response) => {
    try {
      const permissions = await listPermissions();
      res.status(200).json(permissions);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  },
);
// /rbac/roles/{roleId}/permissions - For assigning permissions to a role.
router.post(
  '/rbac/roles/:roleId/permissions',
  auth.required,
  auth.isSystemAdmin,
  async (req: Request, res: Response) => {
    try {
      const role = await connectRoleAndPermissions(Number(req.params.roleId), req.body.permissionIds);
      res.status(201).json(role);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  },
);

export default router;
