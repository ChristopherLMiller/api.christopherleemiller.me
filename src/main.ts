import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as Sentry from '@sentry/node';
import { Logger } from 'nestjs-pino';
import { AppModule } from './app.module';
import { SentryInterceptor } from './interceptors/sentry.interceptor';

const packageData = require('../package.json');

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
    { bufferLogs: true },
  );

  // Setup swagger
  const config = new DocumentBuilder()
    .setTitle('Its Miller Time API')
    .setDescription('API Docs for all itsmillertime.dev sites')
    .setVersion('1.0')
    .addApiKey({ type: 'apiKey', name: 'x-api-key', in: 'header' }, 'x-api-key')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  // enable cors for all origins
  app.enableCors({
    origin: '*',
  });

  // enable logger
  app.useLogger(app.get(Logger));

  // Initialize Sentry
  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    release: packageData.version,
    environment: process.env.NODE_ENV,
    ignoreErrors: [
      'UnsupportedMediaTypeException: No Exif segment found in the given image.',
    ],
  });
  app.useGlobalInterceptors(new SentryInterceptor());

  await app.listen(process.env.PORT || 3000, '0.0.0.0');
}
bootstrap();
