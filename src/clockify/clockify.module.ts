import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClockifyController } from './clockify.controller';
import { ClockifyService } from './clockify.service';

require('dotenv').config();

@Module({
  controllers: [ClockifyController],
  imports: [
    HttpModule.registerAsync({
      useFactory: async (configService: ConfigService) => ({
        baseURL: 'https://api.clockify.me/api/v1',
        headers: {
          'X-Api-Key': process.env.CLOCKIFY_API_KEY,
        },
      }),
    }),
  ],
  providers: [ClockifyService],
})
export class ClockifyModule {}
