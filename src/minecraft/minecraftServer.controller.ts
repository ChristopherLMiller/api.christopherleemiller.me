import {
  Controller,
  Get,
  NotFoundException,
  Param,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { BasicAuthGuard } from 'src/guards/basicAuth.guard';
import { ResponseTransformInterceptor } from 'src/interceptors/responseTransform.interceptor';
import { MinecraftService } from './minecraft.service';

@Controller('minecraft/server')
@ApiTags('minecraft/server')
@UseGuards(BasicAuthGuard)
@UseInterceptors(ResponseTransformInterceptor)
export class MinecraftServerController {
  constructor(private minecraft: MinecraftService) {}

  @Get('rules')
  async getRules(@Query('categoryId') categoryId): Promise<any> {
    const data = await this.minecraft
      .findRules()
      .then((rules) => rules.map((rule) => rule));
    return { data: { rules: data }, meta: { totalRecords: data.length } };
  }

  @Get('rules/:id')
  async getRule(@Param('id') ruleId): Promise<any> {
    const data = await this.minecraft
      .findRule(parseInt(ruleId))
      .then((rule) => {
        if (rule === null) {
          throw new NotFoundException('Rule Not Found');
        }
        return rule;
      });
    return { data: { rule: data } };
  }

  @Get('rules-categories')
  async getRulesCategories(): Promise<any> {
    const data = await this.minecraft.findRulesCategories();
    return { data: { categories: data }, meta: { totalRecords: data.length } };
  }
}
