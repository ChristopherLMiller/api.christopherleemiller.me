import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { MinecraftService } from './minecraft.service';
import { MinecraftServerController } from './minecraftServer.controller';
import { MinecraftStatsController } from './MinecraftStats.controller';

@Module({
  controllers: [MinecraftServerController, MinecraftStatsController],
  imports: [],
  providers: [MinecraftService, PrismaService],
})
export class MInecraftModule {}
