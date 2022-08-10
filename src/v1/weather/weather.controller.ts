import {
  BadRequestException,
  Controller,
  Get,
  Param,
  UseInterceptors,
} from '@nestjs/common';
import { ApiResponse, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { ResponseTransformInterceptor } from 'src/interceptors/responseTransform.interceptor';
import { DataResponse } from 'types';
import { WeatherService } from './weather.service';
import {
  WeatherCurrentDto,
  WeatherLocationDto,
  WeatherZoneDto,
} from './weather.types';

@Controller({ version: '1', path: 'weather' })
@ApiTags('Weather')
@ApiSecurity('x-api-key')
//@UseGuards(BasicAuthGuard)
@UseInterceptors(ResponseTransformInterceptor)
export class WeatherController {
  constructor(private weather: WeatherService) {}

  @Get('location/:position')
  @ApiResponse({ status: 200, description: 'Success' })
  @ApiResponse({
    status: 400,
    description:
      'Bad Request.  Must provide GPS coordinates in format of "lat,lon"',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden, invalid api key supplied or unauthorized',
  })
  async getLocation(
    @Param() params: WeatherLocationDto,
  ): Promise<DataResponse<object>> {
    if (params.position) return await this.weather.getLocation(params.position);

    throw new BadRequestException(
      'Must provide location in format of "lat,lon"',
    );
  }

  @Get('current/coords/:position')
  @ApiResponse({ status: 200, description: 'Success' })
  @ApiResponse({
    status: 400,
    description:
      'Bad Request.  Must provide GPS coordinates in form of "lat,lon"',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden, invalid api key supplied or unauthorized',
  })
  async getWeatherFromCoords(
    @Param() params: WeatherLocationDto,
  ): Promise<DataResponse<object>> {
    if (params.position)
      return await this.weather.getCurrentWeatherFromCoords(params.position);

    throw new BadRequestException(
      'Must provide location in format of "lat,lon"',
    );
  }

  @Get('current/office/:cwa/:gridx/:gridy')
  @ApiResponse({ status: 200, description: 'Success' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({
    status: 403,
    description: 'Forbidden, invalid api key supplied or unauthorized',
  })
  async getWeatherFromOffice(
    @Param() params: WeatherCurrentDto,
  ): Promise<DataResponse<object>> {
    const { cwa, gridX, gridY } = params;

    if (cwa && gridX && gridY)
      return await this.weather.getWeather(cwa, gridX, gridY);

    throw new BadRequestException('Must provide cwa, gridX, and gridY');
  }

  @Get('zone/:position')
  @ApiResponse({ status: 200, description: 'Success' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({
    status: 403,
    description: 'Forbidden, invalid api key supplied or unauthorized',
  })
  async getWeatherZone(
    @Param() params: WeatherLocationDto,
  ): Promise<DataResponse<any>> {
    if (params.position)
      return await this.weather.getWeatherZone(params.position);

    throw new BadRequestException('Must provide position');
  }

  @Get('alerts/coords/:position')
  @ApiResponse({ status: 200, description: 'Success' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({
    status: 403,
    description: 'Forbidden, invalid api key supplied or unauthorized',
  })
  async getAlertsFromCoords(
    @Param() params: WeatherLocationDto,
  ): Promise<DataResponse<any>> {
    return await this.weather.getAlertsFromCoords(params.position);
  }

  @Get('alerts/zone/:zone')
  @ApiResponse({ status: 200, description: 'Success' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({
    status: 403,
    description: 'Forbidden, invalid api key supplied or unauthorized',
  })
  async getAlertsFromZone(
    @Param() params: WeatherZoneDto,
  ): Promise<DataResponse<any>> {
    if (params.zone) return await this.weather.getAlerts(params.zone);

    throw new BadRequestException('Must provide zone');
  }
}
