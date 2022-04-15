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

@Controller('minecraft')
@UseGuards(BasicAuthGuard)
@UseInterceptors(ResponseTransformInterceptor)
export class MinecraftController {
  constructor(private minecraft: MinecraftService) {}

  @Get('rules')
  async getRules(@Query('categoryId') categoryId): Promise<any> {
    const data = await this.minecraft
      .findRules(parseInt(categoryId) || undefined)
      .then((rules) => rules.map((rule) => rule));
    return { data: { rules: data }, meta: { totalRecords: data.length } };
  }

  @Get('rules-categories')
  async getRulesCategories(): Promise<any> {
    const data = await this.minecraft.findRulesCategories();
    return { data: { categories: data }, meta: { totalRecords: data.length } };
  }
}
