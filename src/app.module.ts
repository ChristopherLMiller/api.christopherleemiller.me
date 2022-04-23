import { CacheInterceptor, CacheModule, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { LoggerModule } from 'nestjs-pino';
import { AppController } from './app.controller';
import { ClockifyModule } from './clockify/clockify.module';
import { GithubModule } from './github/github.module';
import { ImagesModule } from './images/images.module';
import { MInecraftModule } from './minecraft/minecraft.module';
import { PrismaService } from './prisma/prisma.service';
import { WebhooksModule } from './webhooks/webhooks.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    CacheModule.register(),
    LoggerModule.forRoot(),
    GithubModule,
    ClockifyModule,
    ImagesModule,
    MInecraftModule,
    WebhooksModule,
  ],
  controllers: [AppController],
  providers: [
    PrismaService,
    {
      provide: APP_INTERCEPTOR,
      useClass: CacheInterceptor,
    },
  ],
})
export class AppModule {}
