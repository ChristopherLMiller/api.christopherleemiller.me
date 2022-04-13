import {
  BadRequestException,
  Body,
  Controller,
  ForbiddenException,
  Headers,
  Post,
} from '@nestjs/common';
import { ClockifyService } from './clockify.service';

@Controller('clockify')
export class ClockifyController {
  constructor(private clockify: ClockifyService) {}

  @Post('webhook/start')
  webhookStart(
    @Headers('clockify-signature') clockifySignature: string,
    @Body() body: any,
  ): any {
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

  @Post('webhook/stop')
  webhookStop(
    @Headers('clockify-signature') clockifySignature: string,
    @Body() body: any,
  ): any {
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
