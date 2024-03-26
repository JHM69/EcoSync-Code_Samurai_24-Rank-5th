import { Router } from 'express'; 
import authController from '../controllers/auth.controller';
import usersController from '../controllers/users.controller'; 
import stsManagerController from  '../controllers/stsmanager.controller';
import landfillController from  '../controllers/landfillmanager.controller';
import rbacController from  '../controllers/rbac.controller';
import vehicleController from '../controllers/vehicle.controller';

const api = Router() 
  .use(usersController) 
  .use(authController)
  .use(stsManagerController)
  .use(landfillController)
  .use(rbacController)
  .use(vehicleController);


export default Router().use('/', api);
