import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { AppModule } from './app.module';
//import { BasicAuthGuard } from './guards/basicAuth.guard';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );

  // enable cors for all origins
  app.enableCors({
    origin: '*',
  });

  // apply the global guards
  //app.useGlobalGuards(new BasicAuthGuard());

  await app.listen(3000);
}
bootstrap();
