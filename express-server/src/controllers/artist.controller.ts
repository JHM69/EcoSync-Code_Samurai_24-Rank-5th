import { NextFunction, Request, Response, Router } from 'express';
import auth from '../utils/auth';
import {
  createArtist,
  deleteArtist,
  getArtist,
  getArtists,
  updateArtist,
} from '../services/artist.service';

const router = Router();

/**
 * Get paginated artists
 * @auth optional
 * @route {GET} /artists
 * @queryparam offset number of artists dismissed from the first one
 * @queryparam limit number of artists returned
 * @queryparam tag
 * @queryparam author
 * @queryparam favorited
 * @returns artists: list of artists
 */
router.get('/artists', auth.optional, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await getArtists(req.query);
    res.json(result);
  } catch (error) {
    next(error);
  }
});

/**
 * Get paginated feed artists
 * @auth required
 * @route {GET} /artists/feed
 * @returns artists list of artists
 */
router.get(
  '/artists',
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
 * Create artist
 * @route {POST} /artists
 * @bodyparam  title
 * @bodyparam  description
 * @bodyparam  body
 * @bodyparam  tagList list of tags
 * @returns artist created artist
 */
router.post('/artists', auth.required, async (req: Request, res: Response, next: NextFunction) => {

  try {
    const artist = await createArtist(req.body, req.user?.username as string);
    res.json({ artist });
  } catch (error) {
    next(error);
  }
});

/**
 * Get unique artist
 * @auth optional
 * @route {GET} /artist/:slug
 * @param slug slug of the artist (based on the title)
 * @returns artist
 */
router.get(
  '/artists/:slug',
  auth.optional,
  async (req: Request, res: Response, next: NextFunction) => {
   
    try {
      const artist = await getArtist(req.params.slug);
      res.json({ artist });
    } catch (error) {
      next(error);
    }
  },
);

/**
 * Update artist
 * @auth required
 * @route {PUT} /artists/:slug
 * @param slug slug of the artist (based on the title)
 * @bodyparam title new title
 * @bodyparam description new description
 * @bodyparam body new content
 * @returns artist updated artist
 */
router.put(
  '/artists/:slug',
  auth.required,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      
      const artist = await updateArtist(
        req.body,
        req.params.slug, 
      );
      res.json({ artist });
    } catch (error) {
      next(error);
    }
  },
);

/**
 * Delete artist
 * @auth required
 * @route {DELETE} /artist/:id
 * @param slug slug of the artist
 */
router.delete(
  '/artists/:slug',
  auth.required,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await deleteArtist(req.params.slug);
      res.sendStatus(204);
    } catch (error) {
      next(error);
    }
  },
);
 

export default router;
