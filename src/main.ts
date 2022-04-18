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
    .addTag('clockify')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  // enable cors for all origins
  app.enableCors({
    origin: '*',
  });

  // enable logger
  app.useLogger(app.get(Logger));

  // Initialize Sentry
  Sentry.init({
    dsn: process.env.SENTRY_DSN,
  });
  app.useGlobalInterceptors(new SentryInterceptor());

  await app.listen(process.env.PORT || 3000, '0.0.0.0');
}
bootstrap();
