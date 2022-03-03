import { Controller, Get, Param } from '@nestjs/common';
import { GithubService } from './github.service';

@Controller('github')
export class GithubController {
  constructor(private github: GithubService) {}

  @Get('user/:login')
  getUser(@Param('login') login: string): any {
    return this.github.findUser(login);
  }
}
