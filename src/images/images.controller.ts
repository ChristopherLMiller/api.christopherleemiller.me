import {
  BadRequestException,
  Controller,
  Get,
  Query,
  UnsupportedMediaTypeException,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { BasicAuthGuard } from 'src/guards/basicAuth.guard';
import { ResponseTransformInterceptor } from 'src/interceptors/responseTransform.interceptor';
import { ImagesService } from './images.service';

@Controller('images')
@UseGuards(BasicAuthGuard)
@UseInterceptors(ResponseTransformInterceptor)
export class ImagesController {
  constructor(private imagesService: ImagesService) {}

  @Get('exif')
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
