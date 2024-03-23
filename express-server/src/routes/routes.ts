import { Router } from 'express'; 
import authController from '../controllers/auth.controller';
import albumController from '../controllers/systemadmin.controller'; 

const api = Router() 
  .use(albumController) 
  .use(authController)


export default Router().use('/', api);
