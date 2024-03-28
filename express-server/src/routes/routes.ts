import { Router } from 'express'; 
  
import usersController from '../controllers/users.controller'; 
import stsManagerController from  '../controllers/stsmanager.controller';
import landfillController from  '../controllers/landfillmanager.controller';
import rbacController from  '../controllers/rbac.controller';
import authController from '../controllers/auth.controller';
import vehicleController from '../controllers/vehicle.controller';
import billController from '../controllers/bill.controller';
import dashboardController from '../controllers/dashboard.controller';

const api = Router() 
  .use(usersController) 
  .use(authController)
  .use(stsManagerController)
  .use(landfillController)
  .use(rbacController)
  .use(vehicleController)
  .use(billController)
  .use(dashboardController);


export default Router().use('/', api);
