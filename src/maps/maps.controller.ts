import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { BasicAuthGuard } from 'src/guards/basicAuth.guard';
import { ResponseTransformInterceptor } from 'src/interceptors/responseTransform.interceptor';
import { MapsService } from './maps.service';

@Controller('map')
@ApiTags('map')
@UseGuards(BasicAuthGuard)
@UseInterceptors(ResponseTransformInterceptor)
export class MapsController {
  constructor(private maps: MapsService) {}

  @Get('markers')
  async getMarkers(): Promise<any> {
    const data = await this.maps.findMapMarkers();
    return { data: { markers: data }, meta: { totalRecords: data.length } };
  }

  @Post('markers')
  async createMarker(@Body() body: any): Promise<any> {
    const data = await this.maps.createMapMarker(body);
    return { data: { marker: data } };
  }
}
