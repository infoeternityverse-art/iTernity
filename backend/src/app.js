import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import mongoSanitize from 'express-mongo-sanitize';
import { config } from './config/index.js';
import { notFoundHandler, errorHandler } from './middlewares/error.middleware.js';
import { apiRouter } from './routes/index.js';

export const app = express();

app.set('trust proxy', 1);

app.use(helmet());
app.use(
  rateLimit({
    windowMs: config.rateLimit.windowMs,
    max: config.rateLimit.max,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
      success: false,
      message: 'Too many requests. Please try again later.',
      errors: [],
    },
  })
);
app.use(
  cors({
    origin: config.corsOrigins,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(mongoSanitize());

if (config.nodeEnv !== 'test') {
  app.use(morgan(config.nodeEnv === 'production' ? 'combined' : 'dev'));
}

app.get('/', (_req, res) =>
  res.status(200).json({
    success: true,
    message: 'iTernityverse backend running successfully.',
    data: {
      service: 'eternityverse-api',
      environment: config.nodeEnv,
    },
  })
);

app.use(apiRouter);

app.use(notFoundHandler);
app.use(errorHandler);
