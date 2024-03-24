/* eslint-disable import/newline-after-import */
/* eslint-disable import/first */
import {  Router } from 'express';
import auth from '../utils/auth'; 
import { calculateAndSaveBillingRecords } from '../services/billing.service';
const router = Router();
  
// POST /billing/calculate
router.post('/calculate', auth.required, auth.isSystemAdmin, async (req, res) => {
    try {
      const { startDate, endDate } = req.body;
        await calculateAndSaveBillingRecords( startDate, endDate );
        
        res.status(200).json({ message: "Billing calculations completed successfully." });
    } catch (error:any) {
        // eslint-disable-next-line no-console
        console.error(error);
        res.status(500).json({ message: "An error occurred during the billing calculation process." });
    }
});
 

export default router;
 