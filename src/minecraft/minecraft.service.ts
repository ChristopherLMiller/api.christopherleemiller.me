import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class MinecraftService {
  constructor(private prisma: PrismaService) {}

  findRules(categoryId: number): any {
    return this.prisma.minecraftRule.findMany({ where: { categoryId } });
  }

  findRulesCategories(): any {
    return this.prisma.minecraftRuleCategory.findMany();
  }
}
