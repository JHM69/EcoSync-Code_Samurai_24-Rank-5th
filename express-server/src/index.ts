import express, { NextFunction, Request, Response } from 'express';
import cors from 'cors'; 
import bodyParser from 'body-parser';
import routes from './routes/routes';
import HttpException from './models/http-exception.model';
import { upload } from './upload';
import { uploadToS3 } from './s3Upload';

const app = express();


/**
 * App Configuration
 */
app.use(cors({ credentials: true, origin: [
  'http://localhost:5001',
  'http://54.80.47.120:5001'
] }));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(routes);

// Serves images
app.use(express.static('public'));



app.post('/api/upload-image', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) throw new Error("File is required");
    const fileUrl = await uploadToS3(req.file, 'shunofiles', 'images');
    res.json({ message: 'Image uploaded successfully', fileUrl });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(error);
    res.status(500).json({ message: error instanceof Error ? error.message : 'An error occurred' });
  }
});

app.post('/api/upload-audio', upload.single('audio'), async (req, res) => {
  try {
    if (!req.file) throw new Error("File is required");
    const fileUrl = await uploadToS3(req.file, 'shunofiles', 'audios');
    res.json({ message: 'Audio uploaded successfully', fileUrl });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(error);
    res.status(500).json({ message: error instanceof Error ? error.message : 'An error occurred' });
  }
});



app.get('/', (req: Request, res: Response) => {
  res.json({ status: 'API is running on /api' });
});











 
/* eslint-disable */
app.use((err: Error | HttpException, req: Request, res: Response, next: NextFunction) => {
  // @ts-ignore
  if (err && err.name === 'UnauthorizedError') {
    return res.status(401).json({
      status: 'error',
      message: 'missing authorization credentials',
    });
    // @ts-ignore
  } else if (err && err.errorCode) {
    // @ts-ignore
    res.status(err.errorCode).json(err.message);
  } else if (err) {
    res.status(500).json(err.message);
  }
});





/**
 * Server activation
 */

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.info(`server up on port ${PORT}`);
});
