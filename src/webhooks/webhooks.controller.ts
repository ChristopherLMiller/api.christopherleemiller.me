import {
  BadRequestException,
  Body,
  Controller,
  ForbiddenException,
  Headers,
  Post,
} from '@nestjs/common';
import { ClockifyTimer } from '@prisma/client';
import { formatDistanceStrict, parseISO } from 'date-fns';
import { PinoLogger } from 'nestjs-pino';
import { ClockifyService } from 'src/clockify/clockify.service';
import { WebhooksService } from './webhooks.service';

@Controller('webhooks')
export class WebhooksController {
  constructor(
    private clockify: ClockifyService,
    private webhooks: WebhooksService,
    private readonly logger: PinoLogger,
  ) {}

  @Post('clockify/start')
  webhookClockifyStart(
    @Headers('clockify-signature') clockifySignature: string,
    @Body() body: any,
  ): Promise<ClockifyTimer> {
    // if the signatures don't match we need to eject with a 403 error
    if (clockifySignature != process.env.CLOCKIFY_SIGNATURE_START) {
      this.logger.error('Invalid Clockify Webhook Signature provided');
      throw new ForbiddenException(
        'Invalid Clockify Webhook Signature provided',
      );
    }

    const { project, timeInterval } = body;

    // if there isn't a projectID eject now
    if (project?.id == null) {
      this.logger.error('Must provide projectID');
      throw new BadRequestException('Must provide projectId');
    }
    // send a message to discord
    this.webhooks.sendDiscordMessage(
      `Clockify timer started - ${project.name}`,
    );

    // return the started timer
    return this.clockify.addClockifyTimer(project.id, timeInterval.start);
  }

  @Post('clockify/stop')
  webhookClockifyStop(
    @Headers('clockify-signature') clockifySignature: string,
    @Body() body: any,
  ): Promise<ClockifyTimer> {
    // if the signatures don't match we need to eject with a 403 error
    if (clockifySignature != process.env.CLOCKIFY_SIGNATURE_STOP) {
      this.logger.error('Invalid Clockify Webhook Signature provided');
      throw new ForbiddenException(
        'Invalid Clockify Webhook Signature provided',
      );
    }
    const { project, timeInterval } = body;

    // if the projectId is null we just will ignore this
    if (project?.id == null) {
      this.logger.error('Must provide projectID');
      throw new BadRequestException('Must provide projectId');
    }

    // convert the timeInterval to a number
    const timeElapsed = formatDistanceStrict(
      parseISO(timeInterval.end),
      parseISO(timeInterval.start),
    );

    // Send a message to discord
    this.webhooks.sendDiscordMessage(
      `Clockify timer stopped - ${project.name}; Elapsed Time: ${timeElapsed}`,
    );
    return this.clockify.removeClockifyTimer(project.id);
  }

  @Post('clockify/delete')
  webhookClockifyDelete(
    @Headers('clockify-signature') clockifySignature: string,
    @Body() body: any,
  ): Promise<ClockifyTimer> {
    // if the signatures don't match we need to eject with a 403 error
    if (clockifySignature != process.env.CLOCKIFY_SIGNATURE_STOP) {
      this.logger.error('Invalid Clockify Webhook Signature provided');
      throw new ForbiddenException(
        'Invalid Clockify Webhook Signature provided',
      );
    }
    const { project } = body;

    // if the projectId is null we just will ignore this
    if (project?.id == null) {
      this.logger.error('Must provide projectID');
      throw new BadRequestException('Must provide projectId');
    }

    // Send a message to discord
    this.webhooks.sendDiscordMessage(
      `Clockify timer deleted - ${project.name}`,
    );
    return this.clockify.removeClockifyTimer(project.id);
  }
}
