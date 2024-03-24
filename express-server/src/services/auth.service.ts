/* eslint-disable import/extensions */
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

// eslint-disable-next-line import/no-unresolved
import prisma from '../../prisma/prisma-client'; 
import generateToken from '../utils/token.utils';
import { sendEmail } from '../utils/mail.service';
import HttpException from '../models/http-exception.model';
 
// Example utility function for sending reset password email
// You need to implement this based on your email service
const sendResetPasswordEmail = async (email : string, token : string) => {
  console.log(`Sending password reset email to ${email} with token ${token}`);

  await sendEmail({
    to: email as string,
    subject: 'Verification Token',
    html: `
      <h1>Your verification token is: ${token}</h1>
    `
  });
};

const createUser = async (userData : any) => {
  const { email, password, name } = userData;
  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    throw new HttpException(400, 'User already exists');
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      name,
      role: {
        connectOrCreate: {
          where: { type: "Unassigned" },
          create: { type: "Unassigned" },
        },
      },
    },
  });
  const token = generateToken(user); // Assume generateToken creates a JWT
  return { ...user, token };
};

const login = async (email  : string, password : string) => {
  const user = await prisma.user.findUnique({ where: { email }, include: { role: true } } );
  if (!user) {
    throw new HttpException(401, 'Authentication failed');
  }
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new HttpException(401, 'Authentication failed');
  }
  const token = generateToken(user);
  return { ...user, token };
};

const logout = async (userId : string) => {
  // code to logout user
  console.log(`User with ID ${userId} logged out`);

};

const initiatePasswordReset = async (email : string) => {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    throw new HttpException(404, 'User not found');
  }

  const resetToken = crypto.randomBytes(20).toString('hex');
  const expiration = new Date(Date.now() + 3600000); // 1 hour from now

  await prisma.passwordResetToken.create({
    data: {
      token: resetToken,
      userId: user.id,
      expiration: expiration,
    },
  });

  sendResetPasswordEmail(email, resetToken);
};
const confirmPasswordReset = async (token : string, newPassword : string) => {
  const passwordResetToken = await prisma.passwordResetToken.findFirst({
    where: {
      token: token,
      expiration: {
        gt: new Date(),
      },
    },
    include: {
      user: true,
    },
  });

  if (!passwordResetToken) {
    throw new HttpException(400, 'Invalid or expired token');
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);
  await prisma.user.update({
    where: { id: passwordResetToken.userId },
    data: { password: hashedPassword },
  });

  // Optionally, delete the token after successful password reset
  await prisma.passwordResetToken.delete({
    where: { id: passwordResetToken.id },
  });
};
const changePassword = async (userId : string, oldPassword : string, newPassword : string) => {
  const user = await prisma.user.findUnique({ where: { id: Number(userId) } });
  if (!user) {
    throw new HttpException(404, 'User not found');
  }
  const isOldPasswordValid = await bcrypt.compare(oldPassword, user.password);
  if (!isOldPasswordValid) {
    throw new HttpException(400, 'Incorrect old password');
  }
  const hashedPassword = await bcrypt.hash(newPassword, 10);
  await prisma.user.update({
    where: { id: Number(userId) },
    data: { password: hashedPassword },
  });
};


export {
  createUser,
  login,
  logout,
  initiatePasswordReset,
  confirmPasswordReset,
  changePassword
};