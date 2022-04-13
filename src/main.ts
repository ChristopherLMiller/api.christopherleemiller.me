import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
//import { BasicAuthGuard } from './guards/basicAuth.guard';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
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

  // apply the global guards
  //app.useGlobalGuards(new BasicAuthGuard());

  await app.listen(3000);
}
bootstrap();
