import express, { NextFunction, Request, Response } from 'express';
import morgan from 'morgan';
import { env } from './config/env';
import webhookRouter from './routes/webhook';
import { logger } from './utils/logger';

const app = express();

app.use(
  express.json({
    verify: (req: any, _res, buf) => {
      req.rawBody = buf.toString('utf8');
    }
  })
);
app.use(morgan('dev'));

app.use(webhookRouter);

app.get('/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok', app: 'Virtuosa Biblias IG Bot' });
});

app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  logger.error('Error inesperado', err);
  res.status(500).json({ error: 'Internal Server Error' });
});

app.listen(env.port, () => {
  logger.info(`Servidor iniciado en puerto ${env.port}`);
});
