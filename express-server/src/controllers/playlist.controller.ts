import { NextFunction, Request, Response, Router } from 'express';
import auth from '../utils/auth';
import {
  createPlaylist,
  deletePlaylist,
  getPlaylist,
  getPlaylistById,
  getPlaylists,
  updatePlaylist,
} from '../services/playlist.service';

const router = Router();

/**
 * Get paginated playlists
 * @auth optional
 * @route {GET} /playlists
 * @queryparam offset number of playlists dismissed from the first one
 * @queryparam limit number of playlists returned
 * @queryparam tag
 * @queryparam author
 * @queryparam favorited
 * @returns playlists: list of playlists
 */
router.get('/playlists', auth.optional, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await getPlaylists(req.query);
    res.json(result);
  } catch (error) {
    next(error);
  }
});

/**
 * Get paginated feed playlists
 * @auth required
 * @route {GET} /playlists/feed
 * @returns playlists list of playlists
 */
router.get(
  '/playlists',
  auth.required,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      res.json("result");
    } catch (error) {
      next(error);
    }
  },
);

/**
 * Create playlist
 * @route {POST} /playlists
 * @bodyparam  title
 * @bodyparam  description
 * @bodyparam  body
 * @bodyparam  tagList list of tags
 * @returns playlist created playlist
 */
router.post('/playlists', auth.required, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const playlist = await createPlaylist(req.body.playlist, req.user?.username as string);
    res.json({ playlist });
  } catch (error) {
    next(error);
  }
});

/**
 * Get unique playlist
 * @auth optional
 * @route {GET} /playlist/:slug
 * @param slug slug of the playlist (based on the title)
 * @returns playlist
 */
router.get(
  '/playlists/:slug',
  auth.optional,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const playlist = await getPlaylist(req.params.slug);
      res.json({ playlist });
    } catch (error) {
      next(error);
    }
  },
);
/**
 * Get unique playlist
 * @auth optional
 * @route {GET} /playlist/:id
 * @param slug of the playlist (based on the title)
 * @returns playlist
 */
router.get(
  '/playlist/:slug',
  auth.optional,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const playlist = await getPlaylistById(req.params.slug);
      res.json( playlist );
    } catch (error) {
      next(error);
    }
  },
);



/**
 * Update playlist
 * @auth required
 * @route {PUT} /playlists/:slug
 * @param slug slug of the playlist (based on the title)
 * @bodyparam title new title
 * @bodyparam description new description
 * @bodyparam body new content
 * @returns playlist updated playlist
 */
router.put(
  '/playlists/:slug',
  auth.required,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const playlist = await updatePlaylist(
        req.body.playlist,
        req.params.slug, 
      );
      res.json({ playlist });
    } catch (error) {
      next(error);
    }
  },
);

/**
 * Delete playlist
 * @auth required
 * @route {DELETE} /playlist/:id
 * @param slug slug of the playlist
 */
router.delete(
  '/playlists/:slug',
  auth.required,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await deletePlaylist(req.params.slug);
      res.sendStatus(204);
    } catch (error) {
      next(error);
    }
  },
);
 

export default router;
