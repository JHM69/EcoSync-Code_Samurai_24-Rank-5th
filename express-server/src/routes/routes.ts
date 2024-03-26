import { Router } from 'express'; 
  
import usersController from '../controllers/users.controller'; 
import stsManagerController from  '../controllers/stsmanager.controller';
import landfillController from  '../controllers/landfillmanager.controller';
import rbacController from  '../controllers/rbac.controller';
import authController from '../controllers/auth.controller';

const api = Router() 
  .use(usersController) 
  .use(authController)
  .use(stsManagerController)
  .use(landfillController)
  .use(rbacController);


export default Router().use('/', api);
