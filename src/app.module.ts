import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { ClockifyModule } from './clockify/clockify.module';
import { GithubModule } from './github/github.module';
import { PrismaService } from './prisma/prisma.service';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    GithubModule,
    ClockifyModule,
  ],
  controllers: [AppController],
  providers: [PrismaService],
})
export class AppModule {}
