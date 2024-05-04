import express, { NextFunction, Request, Response } from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import routes from './routes/routes';
import HttpException from './models/http-exception.model';

const app = express();

/**
 * App Configuration
 */
app.use(cors({ credentials: true, origin: '*' }));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(routes);

// Serves images
app.use(express.static('public'));

app.get('/', (req: Request, res: Response) => {
  res.json({ status: 'API is running - Ecosync Backend by Quantum Guys' });
});
app.post('/', (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  res.json({ status: 'your auth header', authHeader });
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
    res.status(err.errorCode).json({ status: 'error', message: err.message });
  } else if (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

/**
 * Server activation
 */

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.info(`server up on port ${PORT}`);
});
