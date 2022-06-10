import { Injectable } from '@nestjs/common';
import { PinoLogger } from 'nestjs-pino';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class MinecraftService {
  constructor(
    private prisma: PrismaService,
    private readonly logger: PinoLogger,
  ) {}

  findRules(): any {
    return this.prisma.minecraftRule.findMany();
  }

  findRule(ruleId: number): any {
    this.logger.info(ruleId);
    return this.prisma.minecraftRule.findFirst({ where: { id: ruleId } });
  }

  findRulesCategories(): any {
    return this.prisma.minecraftRuleCategory.findMany();
  }
}
