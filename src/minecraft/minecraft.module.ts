import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { MinecraftController } from './minecraft.controller';
import { MinecraftService } from './minecraft.service';

@Module({
  controllers: [MinecraftController],
  imports: [],
  providers: [MinecraftService, PrismaService],
})
export class MInecraftModule {}
