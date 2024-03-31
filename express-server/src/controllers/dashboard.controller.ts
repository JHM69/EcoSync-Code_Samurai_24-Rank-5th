 


import { Request, Response, NextFunction, Router } from 'express';
// eslint-disable-next-line import/no-extraneous-dependencies
import NodeCache from 'node-cache';
import auth from '../utils/auth';
  
import { dashboardData, getBillsData, getBillFilterData } from '../services/dashboard.service';
 
// Extend the Express Request interface to include cacheKey
declare global {
  // eslint-disable-next-line no-unused-vars
  namespace Express {
    // eslint-disable-next-line no-shadow, no-unused-vars
    interface Request {
      cacheKey?: string;
    }
  }
}

const ecoSyncCache = new NodeCache({ stdTTL: 60 }); // 2 minutes cache
const router = Router();

function generateCacheKey(query: any): string {
  return `dashboard-${JSON.stringify(query)}`;
}

async function cacheMiddleware(req: Request, res: Response, next: NextFunction): Promise<void> {
  const cacheKey = generateCacheKey(req.query);
  const cachedData = ecoSyncCache.get(cacheKey);
  
  if (cachedData) {
    // eslint-disable-next-line no-console
    console.log("Serving from cache");
    res.json(cachedData);
  } else {
    // Attach cacheKey to the request to use in the route
    req.cacheKey = cacheKey;
    next();
  }
}
 
router.get('/dashboard', auth.required, auth.isSystemAdmin, cacheMiddleware, async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Check if cacheKey is attached to the request
    if (req.cacheKey) {
      // eslint-disable-next-line no-console
      console.log("Serving from service");
      const result = await dashboardData(
        req?.query?.startDate as string, 
        req?.query?.endDate as string,
      );
      // Cache the new result using the cacheKey from the request
      ecoSyncCache.set(req.cacheKey, result);
      res.json(result);
    } else {
      throw new Error('Cache key is missing');
    }
  } catch (error) {
    next(error);
  }
});



router.get('/dashboard-bills-filter', auth.required, auth.isSystemAdmin, async (req: Request, res: Response, next: NextFunction) => {
  try {
     
      const result = await getBillFilterData();
      // Cache the new result using the cacheKey from the request
     
      res.json(result);
   
  } catch (error) {
    next(error);
  }
}); 


router.get('/dashboard-bills', auth.required, auth.isSystemAdmin, async (req: Request, res: Response, next: NextFunction) => {
  try {
      // eslint-disable-next-line no-console
      console.log("Serving from service");
      const result = await getBillsData(
        req?.query?.startDate as string, 
        req?.query?.endDate as string,
        req?.query?.vehicleId as string,
        req?.query?.stsId as string,
        req?.query?.landfillId as string,
        req?.query?.isVerified as string,
        req?.query?.isPaid as string,
        req?.query?.page as string,
        req?.query?.limit as string,
        );
      // Cache the new result using the cacheKey from the request
     
      res.json(result);
   
  } catch (error) {
    next(error);
  }
});
export default router;
