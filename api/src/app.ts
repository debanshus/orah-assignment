import 'dotenv/config';
import 'reflect-metadata';
import express, { Request, Response } from 'express';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Swagger definition
const swaggerOptions: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Orah API',
      version: '1.0.0',
      description: 'Orah backend API documentation',
    },
    servers: [
      {
        url: `http://localhost:${process.env.PORT || 3000}`,
        description: 'Local development server',
      },
    ],
  },
  apis: ['./src/**/*.ts'],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Redirect root to swagger docs
app.get('/', (req: Request, res: Response) => {
  res.redirect('/api-docs');
});

import routes from './routes';

app.use('/', routes);

// 404 fallback
app.use((_req: Request, res: Response) => {
  res.status(404).json({ message: 'Route not found' });
});

export default app;

