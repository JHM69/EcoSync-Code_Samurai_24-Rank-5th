import { NextFunction, Request, Response } from "express";

const jwt = require('express-jwt');

const getTokenFromHeaders = (req: { headers: { authorization: string } }): string | null => {
  if (
    (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Token') ||
    (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer')
  ) {
    return req.headers.authorization.split(' ')[1];
  }
  return null;
};

const auth = { 
  required: jwt({
    secret: process.env.JWT_SECRET || 'superSecret',
    getToken: getTokenFromHeaders,
    algorithms: ['HS256'],
  }),
  optional: jwt({
    secret: process.env.JWT_SECRET || 'superSecret',
    credentialsRequired: false,
    getToken: getTokenFromHeaders,
    algorithms: ['HS256'],
  }),
  isSystemAdmin: (req: Request, res: Response, next: NextFunction) => {
    // Assuming 'admin' is the role name for administrators
    if (req.user && req.user.role.type === 'SystemAdmin') {
      next();
    } else {
      res.status(403).json({ message: 'Forbidden: System Admin access required.' });
    }
  },
  isSTSManager : (req: Request, res: Response, next: NextFunction) => {
    // Assuming 'manager' is the role name for managers
    if (req.user && req.user.role.type === 'STSManager') {
      next();
    } else {
      res.status(403).json({ message: 'Forbidden: Manager access required.' });
    }
  },
  isLandfillManager : (req: Request, res: Response, next: NextFunction) => {
    // Assuming 'manager' is the role name for managers
    if (req.user && req.user.role.type === 'LandfillManager') {
      next();
    } else {
      res.status(403).json({ message: 'Forbidden: Manager access required.' });
    }
  },
};

export default auth;
