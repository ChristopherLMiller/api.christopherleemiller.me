import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { WebhooksService } from 'src/webhooks/webhooks.service';
import { ClockifyController } from './clockify.controller';
import { ClockifyService } from './clockify.service';

require('dotenv').config();

@Module({
  controllers: [ClockifyController],
  imports: [
    HttpModule.register({
      baseURL: 'https://api.clockify.me/api/v1',
      headers: {
        'X-Api-Key': process.env.CLOCKIFY_API_KEY,
      },
    }),
  ],
  providers: [ClockifyService, PrismaService, WebhooksService],
})
export class ClockifyModule {}
