import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  Headers,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { ClockifyService } from './clockify.service';

@Controller('clockify')
export class ClockifyController {
  constructor(private clockify: ClockifyService) {}

  @Get('clients')
  getClients(
    @Query('archived') archived: boolean,
    @Query('name') name: string,
    @Query('page') page: number,
    @Query('page-size') pageSize: number,
    @Query('sort-column') sortColumn: string,
    @Query('sort-order') sortOrder: 'ASCENDING' | 'DESCENDING',
  ): any {
    const response = this.clockify.getClients(
      archived,
      name,
      page,
      pageSize,
      sortColumn,
      sortOrder,
    );

    return response;
  }

  @Get('clients/:id')
  getClientById(@Param('id') id: string): any {
    return this.clockify.getClient(id);
  }

  @Post('clients')
  createClient(@Body('name') name: string): any {
    return this.clockify.createClient(name);
  }

  @Put('clients/:id')
  updateClient(
    @Param('id') id: string,
    @Body('name') name: string,
    @Body('archived') archived: boolean,
  ): any {
    console.log(id, name, archived);
    return this.clockify.updateClient(id, name, archived);
  }

  @Delete('clients/:id')
  deleteClient(@Param('id') id: string): any {
    return this.clockify.deleteClient(id);
  }

  @Get('projects')
  getProjects(
    @Param('hydrated') hydrated: boolean,
    @Param('archived') archived: boolean,
    @Param('name') name: string,
    @Param('oage') page: number,
    @Param('page-size') pageSize: number,
    @Param('billable') billable: boolean,
    @Param('clients') clients: Array<string>,
    @Param('contains-client') containsClient: boolean,
    @Param('client-status') clientStatus: 'ACTIVE' | 'ARCHIVED',
    @Param('users') users: Array<string>,
    @Param('contains-user') containsUser: boolean,
    @Param('user-status') userStatus: 'ACTIVE' | 'INACTIVE',
    @Param('is-template') isTemplate: boolean,
    @Param('sort-column') sortColumn: 'NAME' | 'CLIENT_NAME' | 'DURATION',
    @Param('sort-order') sortOrder: 'ASCENDING' | 'DESCENDING',
  ) {
    return this.clockify.getProjects(
      hydrated,
      archived,
      name,
      page,
      pageSize,
      billable,
      clients,
      containsClient,
      clientStatus,
      users,
      containsUser,
      userStatus,
      isTemplate,
      sortColumn,
      sortOrder,
    );
  }

  @Post('webhook')
  getWebhook(
    @Headers('clockify-signature') clockifySignature: string,
    @Body() body: any,
  ): any {
    console.log(body);

    // if the signatures don't match we need to eject with a 403 error
    if (clockifySignature != process.env.CLOCKIFY_WEBHOOK_SIGNATURE) {
      throw new ForbiddenException('Invalid signature');
    }

    // if the projectId is null we just will ignore this
    if (body.projectId != null) {
      console.log('adding projectID', body.projectId);
      return this.clockify.addClockifyTimer(body.projectId);
    }
  }
}
