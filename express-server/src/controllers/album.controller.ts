import { NextFunction, Request, Response, Router } from 'express';
import auth from '../utils/auth';
import {
  createAlbum,
  deleteAlbum,
  getAlbum,
  getAlbumById,
  getAlbums,
  updateAlbum,
} from '../services/album.service';

const router = Router();

/**
 * Get paginated albums
 * @auth optional
 * @route {GET} /albums
 * @queryparam offset number of albums dismissed from the first one
 * @queryparam limit number of albums returned
 * @queryparam tag
 * @queryparam author
 * @queryparam favorited
 * @returns albums: list of albums
 */
router.get('/albums', auth.optional, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await getAlbums(req.query);
    res.json(result);
  } catch (error) {
    next(error);
  }
});

/**
 * Get paginated feed albums
 * @auth required
 * @route {GET} /albums/feed
 * @returns albums list of albums
 */
router.get(
  '/albums',
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
 * Create album
 * @route {POST} /albums
 * @bodyparam  title
 * @bodyparam  description
 * @bodyparam  body
 * @bodyparam  tagList list of tags
 * @returns album created album
 */
router.post('/albums', auth.required, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const album = await createAlbum(req.body, req.user?.username as string);
    res.json({ album });
  } catch (error) {
    next(error);
  }
});

/**
 * Get unique album
 * @auth optional
 * @route {GET} /album/:slug
 * @param slug slug of the album (based on the title)
 * @returns album
 */
router.get(
  '/albums/:slug',
  auth.optional,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const album = await getAlbum(req.params.slug);
      res.json({ album });
    } catch (error) {
      next(error);
    }
  },
);

router.get(
  '/album/:slug',
  auth.optional,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const album = await getAlbumById(req.params.slug);
      res.json(album);
    } catch (error) {
      next(error);
    }
  },
);


/**
 * Update album
 * @auth required
 * @route {PUT} /albums/:slug
 * @param slug slug of the album (based on the title)
 * @bodyparam title new title
 * @bodyparam description new description
 * @bodyparam body new content
 * @returns album updated album
 */
router.put(
  '/albums/:slug',
  auth.required,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const album = await updateAlbum(
        req.body,
        req.params.slug, 
      );
      res.json({ album });
    } catch (error) {
      next(error);
    }
  },
);

/**
 * Delete album
 * @auth required
 * @route {DELETE} /album/:id
 * @param slug slug of the album
 */
router.delete(
  '/albums/:slug',
  auth.required,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await deleteAlbum(req.params.slug);
      res.sendStatus(204);
    } catch (error) {
      next(error);
    }
  },
);
 

export default router;
