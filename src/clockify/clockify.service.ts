import { HttpService } from '@nestjs/axios';
import { BadRequestException, Injectable } from '@nestjs/common';
import { PinoLogger } from 'nestjs-pino';
import { Observable } from 'rxjs';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ClockifyService {
  constructor(
    private prisma: PrismaService,
    private http: HttpService,
    private readonly logger: PinoLogger,
  ) {}

  addClockifyTimer(projectId: string, startTime: string) {
    return this.prisma.clockifyTimer.create({ data: { projectId, startTime } });
  }

  removeClockifyTimer(projectID: string) {
    return this.prisma.clockifyTimer.delete({
      where: { projectId: projectID },
    });
  }

  getWorkspaces(): Observable<any> {
    return this.http.get('workspaces');
  }

  startTimer(projectId: string): Observable<any> {
    if (projectId === null) {
      throw new BadRequestException('Must provide projectId');
    }

    return this.http.post(
      `/workspaces/${process.env.CLOCKIFY_WORKSPACE_ID}/time-entries`,
      {
        projectId,
      },
    );
  }

  stopTimer(): Observable<any> {
    return this.http.patch(
      `/workspaces/${process.env.CLOCKIFY_WORKSPACE_ID}/user/${process.env.CLOCKIFY_USER_ID}/time-entries`,
      {
        end: new Date().toISOString(),
      },
    );
  }
}
