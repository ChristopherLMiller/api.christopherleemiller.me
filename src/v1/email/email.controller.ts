import { Controller, Post, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { BasicAuthGuard } from 'src/guards/basicAuth.guard';
import { ResponseTransformInterceptor } from 'src/interceptors/responseTransform.interceptor';

@Controller({ version: '1', path: 'email' })
@ApiTags('Email')
@UseGuards(BasicAuthGuard)
@UseInterceptors(ResponseTransformInterceptor)
export class EmailController {
  cosntructor() {}

  @Post('send')
  sendEmail(): any {
    return true;
  }
}
