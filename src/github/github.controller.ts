import {
  Controller,
  Get,
  Param,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { BasicAuthGuard } from 'src/guards/basicAuth.guard';
import { ResponseTransformInterceptor } from 'src/interceptors/responseTransform.interceptor';
import { GithubService } from './github.service';

@Controller('github')
@UseGuards(BasicAuthGuard)
@UseInterceptors(ResponseTransformInterceptor)
export class GithubController {
  constructor(private github: GithubService) {}

  @Get('user/:login')
  getUser(@Param('login') login: string): any {
    return this.github.findUser(login);
  }
}
