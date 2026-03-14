import swaggerJSDoc, { Options } from 'swagger-jsdoc';
import path from 'path';
import { config } from './config/config';

const options: Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'EASY-EAT API',
      version: '1.0.0',
      description: 'REST API for Restaurants and Customers',
    },
    servers: [
      {
        url: `http://localhost:${config.server.port}`,
      },
    ],
  },

  // IMPORTANT: read the compiled .js files in build/routes
  apis: [path.join(__dirname, 'routes', '*.js')],
};

export const swaggerSpec = swaggerJSDoc(options);
