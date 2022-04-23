import {
  BadRequestException,
  Controller,
  Get,
  HttpCode,
  Query,
  UnsupportedMediaTypeException,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { BasicAuthGuard } from 'src/guards/basicAuth.guard';
import { ResponseTransformInterceptor } from 'src/interceptors/responseTransform.interceptor';
import { ImagesService } from './images.service';

@Controller('images')
@ApiTags('images')
@UseGuards(BasicAuthGuard)
@UseInterceptors(ResponseTransformInterceptor)
export class ImagesController {
  constructor(private imagesService: ImagesService) {}

  @Get('exif')
  @HttpCode(200)
  @ApiOperation({ summary: 'Get an Images EXIF data' })
  @ApiResponse({ status: 200, description: 'Success' })
  @ApiResponse({ status: 415, description: 'Unsupported Media Type' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async getExif(@Query('url') url: string): Promise<any> {
    if (!url) {
      throw new BadRequestException('Image url is required');
    }

    // try and get the contents
    try {
      if (url) {
        const data = await this.imagesService.getExifData(url);
        return { data, meta: { url: url } };
      }
    } catch (error) {
      // if we are unable to get the EXIF data for whatever reason
      throw new UnsupportedMediaTypeException(error.message);
    }
  }
}
