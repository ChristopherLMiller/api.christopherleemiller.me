import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ClockifyController } from './clockify.controller';
import { ClockifyService } from './clockify.service';

require('dotenv').config();

@Module({
  controllers: [ClockifyController],
  imports: [],
  providers: [ClockifyService, PrismaService],
})
export class ClockifyModule {}
