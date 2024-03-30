import e, { NextFunction, Request, Response } from 'express';

const jwt = require('express-jwt');
import dotenv from 'dotenv';
import prisma from '../../prisma/prisma-client';
import { User } from '@prisma/client';
import HttpException from '../models/http-exception.model';
dotenv.config();

const getTokenFromHeaders = (req: { headers: { authorization: string } }): string | null => {
  if (
    (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Token') ||
    (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer')
  ) {
    // console.log(req.headers.authorization.split(' ')[1]);
    return req.headers.authorization.split(' ')[1];
  }
  return null;
};

const secureMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  await jwt({
    secret: process.env.JWT_SECRET || 'superSecret',
    getToken: getTokenFromHeaders,
    algorithms: ['HS256'],
  })(req, res, async () => {
    try {
      if (!req.user) throw new HttpException(400, 'Invalid token');
      
      const existingUser = await prisma.user.findUnique({
        where: { id: req.user.id },
        include: { role: true },
      });
      if (!existingUser) throw new HttpException(404, 'Token User not found.');
      // if lastLogin is of token is less than lastLogout of user, then token is invalid
      const lastLogin = new Date(req.user.lastLogin);
      const lastLogout = new Date(existingUser.lastLogout);
      if (lastLogin < lastLogout)
        throw new HttpException(403, 'Forbidden: Token session expired. Login again.');

      if (existingUser.role.type !== req.user.role.type)
        throw new HttpException(403, 'Forbidden: Role type mismatch. Login again.');

      if (existingUser.password !== req.user.password)
        throw new HttpException(403, 'Forbidden: Password mismatch. Login again.');

      next();
    } catch (error:any) {
      // next(error);
      console.log(error);
      res.status(error.status || 500).json({ message: error.message || 'Internal Server Error'});
    }
  });
};

const auth = {
  required: secureMiddleware,
  optional: jwt({
    secret: process.env.JWT_SECRET || 'superSecret',
    credentialsRequired: false,
    getToken: getTokenFromHeaders,
    algorithms: ['HS256'],
  }),
  isSystemAdmin: async (req: Request, res: Response, next: NextFunction) => {
    try {
      console.log(req.user);
    if (req.user && req.user.role.type === 'SystemAdmin') {
      next();
    } else {
      res.status(403).json({ message: 'Forbidden: System Admin access required.' });
    }
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  },
  isSTSManager: async (req: Request, res: Response, next: NextFunction) => {
    try {
      console.log(req.user);
    if (req.user && req.user.role.type === 'STSManager') {
      next();
    } else {
      res.status(403).json({ message: 'Forbidden: STS Manager access required.' });
    }
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  },
  isLandfillManager: async (req: Request, res: Response, next: NextFunction) => {
    try {
      console.log(req.user);
    if (req.user && req.user.role.type === 'LandfillManager') {
      next();
    } else {
      console.log(req.user);
      res.status(403).json({ message: 'Forbidden: Landfill Manager access required.' });
    }
    } catch (error) {
      res.status(500).json({ message: "Internal Server Error" });
    }
  },
};

export default auth;
