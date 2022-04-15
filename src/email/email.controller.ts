import { Controller, Post, UseGuards, UseInterceptors } from '@nestjs/common';
import { BasicAuthGuard } from 'src/guards/basicAuth.guard';
import { ResponseTransformInterceptor } from 'src/interceptors/responseTransform.interceptor';

@Controller('email')
@UseGuards(BasicAuthGuard)
@UseInterceptors(ResponseTransformInterceptor)
export class EmailController {
  cosntructor() {}

  @Post('send')
  sendEmail(): any {
    return true;
  }
}
