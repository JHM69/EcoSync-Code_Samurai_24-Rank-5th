import { Router } from 'express'; 
import authController from '../controllers/auth.controller';
import systemAdminController from '../controllers/systemadmin.controller'; 
import stsManagerController from  '../controllers/stsmanager.controller';
import landfillController from  '../controllers/landfillmanager.controller';

const api = Router() 
  .use(systemAdminController) 
  .use(authController)
  .use(stsManagerController)
  .use(landfillController);


export default Router().use('/', api);
