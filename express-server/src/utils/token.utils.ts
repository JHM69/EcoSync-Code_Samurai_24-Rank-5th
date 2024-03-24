import { User } from '@prisma/client';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();
 
const generateToken = (user: Partial<User>): string =>
  jwt.sign(user, process.env.JWT_SECRET || 'superSecret', { expiresIn: '60d' });

export default generateToken;
