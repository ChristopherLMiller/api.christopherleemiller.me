import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { BasicAuthGuard } from 'src/guards/basicAuth.guard';
import { ResponseTransformInterceptor } from 'src/interceptors/responseTransform.interceptor';
import { ClockifyService } from './clockify.service';

@Controller('clockify')
@UseGuards(BasicAuthGuard)
@UseInterceptors(ResponseTransformInterceptor)
export class ClockifyController {
  constructor(private clockify: ClockifyService) {}

  @Get('workspaces')
  getWorkspaces(): Observable<any> {
    return this.clockify.getWorkspaces();
  }

  @Post('start-timer')
  startTimer(@Body() body: any): Observable<any> {
    return this.clockify.startTimer(body?.projectId);
  }

  @Post('stop-timer')
  stopTimer(@Body() body: any): Observable<any> {
    return this.clockify.stopTimer(body?.projectId);
  }
}
