/* eslint-disable no-console */
import { NextFunction, Request, Response, Router } from 'express';
import auth from '../utils/auth';
import * as authService from '../services/auth.service';

const router = Router();

router.post('/auth/create',auth.required,auth.isSystemAdmin, async (req: Request, res: Response, next: NextFunction) => {
 console.log("auth.create");
  try {
    const user = await authService.createUser(req.body);
    res.status(201).json({ user });
  } catch (error) {
    next(error);
  }
});

router.post('/auth/login', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;
    const user = await authService.login(email, password);
    res.json({ user });
  } catch (error) {
    next(error);
  }
});

router.get('/auth/logout', auth.required, async (req: Request, res: Response) => {
  // Logout functionality depends on your session/token management strategy
  await authService.logout(req.user.id);
  res.status(200).json({ message: 'Successfully logged out' });
});

router.post('/auth/reset-password/initiate', async (req: Request, res: Response, next: NextFunction) => {
  try {
    await authService.initiatePasswordReset(req.body.email);
    res.status(200).json({ message: 'If a matching account was found, an email was sent to reset your password.' });
  } catch (error) {
    next(error);
  }
});

router.post('/auth/reset-password/confirm', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { token, newPassword } = req.body;
    await authService.confirmPasswordReset(token, newPassword);
    res.status(200).json({ message: 'Your password has been reset successfully.' });
  } catch (error) {
    next(error);
  }
});

router.post('/auth/change-password', auth.required, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const {user} = req;
    if (!user) {
      throw new Error('Invalid Token');
    }
    // @ts-ignore
    const newUser = await authService.changePassword(user.id, oldPassword, newPassword);
    res.status(200).json({ message: 'Password changed successfully.', newUser });
  } catch (error) {
    next(error);
  }
});
 
export default router;
