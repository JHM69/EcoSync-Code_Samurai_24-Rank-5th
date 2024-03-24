import { Router } from 'express';
import tagsController from '../controllers/tag.controller';
import articlesController from '../controllers/article.controller';
import authController from '../controllers/auth.controller';
import profileController from '../controllers/profile.controller';
import songController from '../controllers/song.controller';
import albumController from '../controllers/album.controller';
import artistController from '../controllers/artist.controller';
import playlistController from '../controllers/playlist.controller';  
import homeController from '../controllers/home.controller';  

const api = Router()
  .use(tagsController)
  .use(articlesController)
  .use(profileController)
  .use(songController)
  .use(albumController)
  .use(artistController)
  .use(playlistController)
  .use(authController)
  .use(homeController)


export default Router().use('/api', api);
