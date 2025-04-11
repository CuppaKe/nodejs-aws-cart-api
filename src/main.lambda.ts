import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import { configure as serverlessExpress } from '@vendia/serverless-express';
import express from 'express';

import { AppModule } from './app.module';

let cachedServer;

async function bootstrap() {
  try {
    if (!cachedServer) {
      console.log('Bootstrap starting...');
      const expressApp = express();

      const app = await NestFactory.create(
        AppModule,
        new ExpressAdapter(expressApp),
        {
          logger: ['error', 'warn', 'debug', 'log', 'verbose'],
        },
      );

      console.log('NestJS app created');

      await app.init();
      console.log('App initialized');

      cachedServer = serverlessExpress({ app: expressApp });
    }
  } catch (error) {
    console.error('Bootstrap error:', error);
    throw error;
  }

  return cachedServer;
}

export const handler = async (event, context, callback) => {
  const server = await bootstrap();
  return server(event, context, callback);
};
