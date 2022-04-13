import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ClockifyService {
  constructor(private prisma: PrismaService) {}

  addClockifyTimer(projectId: string, startTime: string) {
    return this.prisma.clockifyTimer.create({ data: { projectId, startTime } });
  }

  removeClockifyTimer(projectID: any) {
    return this.prisma.clockifyTimer.delete({
      where: { projectId: projectID },
    });
  }
}
