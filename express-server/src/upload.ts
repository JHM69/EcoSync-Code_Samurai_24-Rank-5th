// upload.ts
import multer from 'multer';

// eslint-disable-next-line import/prefer-default-export
export const upload = multer({
  storage: multer.memoryStorage()
});