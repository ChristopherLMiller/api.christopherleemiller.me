import {
  Controller,
  Get,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { BasicAuthGuard } from 'src/guards/basicAuth.guard';
import { ResponseTransformInterceptor } from 'src/interceptors/responseTransform.interceptor';
import { MinecraftService } from './minecraft.service';

@Controller('minecraft/stats')
@UseGuards(BasicAuthGuard)
@UseInterceptors(ResponseTransformInterceptor)
export class MinecraftStatsController {
  constructor(private minecraft: MinecraftService) {}

  @Get('player/:id')
  async getStats(@Query('id') id): Promise<any> {
    return { data: { stats: [] }, meta: { playerId: id } };
  }
}
