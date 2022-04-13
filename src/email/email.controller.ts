import { Controller, Post } from '@nestjs/common';

@Controller('email')
export class EmailController {
  cosntructor() {}

  @Post('send')
  sendEmail(): any {
    return true;
  }
}
