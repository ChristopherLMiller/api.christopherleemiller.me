import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
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
    }),
    GithubModule,
    ClockifyModule,
    ImagesModule,
    MInecraftModule,
    WebhooksModule,
  ],
  controllers: [AppController],
  providers: [PrismaService],
})
export class AppModule {}
