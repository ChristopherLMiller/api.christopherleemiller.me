import { Controller, UseGuards, UseInterceptors } from '@nestjs/common';
import { BasicAuthGuard } from 'src/guards/basicAuth.guard';
import { ResponseTransformInterceptor } from 'src/interceptors/responseTransform.interceptor';

@Controller('clockify')
@UseGuards(BasicAuthGuard)
@UseInterceptors(ResponseTransformInterceptor)
export class ClockifyController {
  constructor() {}
}
