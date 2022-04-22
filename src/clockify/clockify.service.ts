import { HttpService } from '@nestjs/axios';
import { BadRequestException, Injectable } from '@nestjs/common';
import { PinoLogger } from 'nestjs-pino';
import { Observable } from 'rxjs';
import { PrismaService } from 'src/prisma/prisma.service';
import { WebhooksService } from 'src/webhooks/webhooks.service';

@Injectable()
export class ClockifyService {
  constructor(
    private prisma: PrismaService,
    private http: HttpService,
    private readonly logger: PinoLogger,
    private webhooks: WebhooksService,
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

    // kick off the webhook for the timer start
    this.webhooks.sendDiscordMessage(`Clockify Project Started - ${projectId}`);
    return this.http.post(
      `/workspaces/${process.env.CLOCKIFY_WORKSPACE_ID}/time-entries`,
      {
        projectId,
      },
    );
  }

  stopTimer(projectId: string): Observable<any> {
    this.webhooks.sendDiscordMessage(`Clockify Project Stopped - ${projectId}`);
    return this.http.patch(
      `/workspaces/${process.env.CLOCKIFY_WORKSPACE_ID}/user/${process.env.CLOCKIFY_USER_ID}/time-entries`,
      {
        end: new Date().toISOString(),
      },
    );
  }
}
