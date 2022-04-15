import { Module } from '@nestjs/common';
import { ClockifyService } from 'src/clockify/clockify.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { WebhooksController } from './webhooks.controller';
import { WebhooksService } from './webhooks.service';

@Module({
  controllers: [WebhooksController],
  providers: [WebhooksService, ClockifyService, PrismaService],
})
export class WebhooksModule {}
