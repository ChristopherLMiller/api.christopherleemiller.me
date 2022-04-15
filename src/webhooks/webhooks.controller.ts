import {
  BadRequestException,
  Body,
  Controller,
  ForbiddenException,
  Headers,
  Post,
} from '@nestjs/common';
import { ClockifyTimer } from '@prisma/client';
import { ClockifyService } from 'src/clockify/clockify.service';

@Controller('webhooks')
export class WebhooksController {
  constructor(private clockify: ClockifyService) {}

  @Post('clockify/start')
  webhookStart(
    @Headers('clockify-signature') clockifySignature: string,
    @Body() body: any,
  ): Promise<ClockifyTimer> {
    // if the signatures don't match we need to eject with a 403 error
    if (clockifySignature != process.env.CLOCKIFY_SIGNATURE_START) {
      console.log('Invalid Clockify Webhook Signature provided');
      throw new ForbiddenException(
        'Invalid Clockify Webhook Signature provided',
      );
    }

    const { projectId, timeInterval } = body;

    // if there isn't a projectID eject now
    if (projectId == null) {
      console.log('Must provide projectID');
      throw new BadRequestException('Must provide projectId');
    }

    return this.clockify.addClockifyTimer(projectId, timeInterval.start);
  }

  @Post('clockify/stop')
  webhookStop(
    @Headers('clockify-signature') clockifySignature: string,
    @Body() body: any,
  ): Promise<ClockifyTimer> {
    // if the signatures don't match we need to eject with a 403 error
    if (clockifySignature != process.env.CLOCKIFY_SIGNATURE_STOP) {
      console.log('Invalid Clockify Webhook Signature provided');
      throw new ForbiddenException(
        'Invalid Clockify Webhook Signature provided',
      );
    }
    // if the projectId is null we just will ignore this
    if (body.projectId == null) {
      console.log('Must provide projectID');
      throw new BadRequestException('Must provide projectId');
    }

    return this.clockify.removeClockifyTimer(body.projectId);
  }
}
