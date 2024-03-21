/* eslint-disable no-console */
import { NextFunction, Request, Response, Router } from 'express';
import auth from '../utils/auth';
import { getSong, 
  getSongs, 
  createSong, 
  updateSong, 
  deleteSong,
  aiSearchSongs,
  aiSearchPodcasts,
  aiSearchAudiobooks,
  aiSearchPoems
 } from '../services/songs.service';
 

const router = Router();

/**
 * Get paginated songs
 * @auth optional
 * @route {GET} /songs
 * @queryparam offset number of songs dismissed from the first one
 * @queryparam limit number of songs returned
 * @queryparam tag
 * @queryparam author
 * @queryparam favorited
 * @returns songs: list of songs
 */
router.get('/songs', auth.optional, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await getSongs(req.query);
    res.json(result);
  } catch (error) {
    next(error);
  }
});

 
router.get(
  '/ai-search-songs',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await aiSearchSongs(req.query);
      res.json(result);
    } catch (error) {
      next(error);
    }
  },
);

 
router.get(
  '/ai-search-podcasts',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await aiSearchPodcasts(req.query);
      res.json(result);
    } catch (error) {
      next(error);
    }
  },
);


router.get(
  '/ai-search-audiobooks',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await aiSearchAudiobooks(req.query);
      res.json(result);
    } catch (error) {
      next(error);
    }
  },
);

 
router.get(
  '/ai-search-poems',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await aiSearchPoems(req.query);
      res.json(result);
    } catch (error) {
      next(error);
    }
  },
);



/**
 * Create song
 * @route {POST} /songs
 * @bodyparam  title
 * @bodyparam  description
 * @bodyparam  body
 * @bodyparam  tagList list of tags
 * @returns song created song
 */
router.post('/songs', auth.required, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const song = await createSong(req.body, req.user?.username as string);
    res.json({ song });
  } catch (error) {
    next(error);
  }
});

/**
 * Get unique song
 * @auth optional
 * @route {GET} /song/:slug
 * @param slug slug of the song (based on the title)
 * @returns song
 */
router.get(
  '/songs/:slug',
  auth.optional,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const song = await getSong(req.params.slug);
      res.json({ song });
    } catch (error) {
      next(error);
    }
  },
);

/**
 * Update song
 * @auth required
 * @route {PUT} /songs/:slug
 * @param slug slug of the song (based on the title)
 * @bodyparam title new title
 * @bodyparam description new description
 * @bodyparam body new content
 * @returns song updated song
 */
router.put(
  '/songs/:id',
  auth.required,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const song = await updateSong(
        req.body,
        req.params.id, 
      );
      res.json({ song });
    } catch (error) {
      console.log(req.params.id) 
      console.log(error);
      next(error);
    }
  },
);

/**
 * Delete song
 * @auth required
 * @route {DELETE} /song/:id
 * @param slug slug of the song
 */
router.delete(
  '/songs/:slug',
  auth.required,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await deleteSong(req.params.slug);
      res.sendStatus(204);
    } catch (error) {
      next(error);
    }
  },
);
 

export default router;
