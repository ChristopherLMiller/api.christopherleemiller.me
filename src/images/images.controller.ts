import {
  BadRequestException,
  Body,
  Controller,
  Post,
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

  @Post('exif')
  async getExif(@Body() body: any): Promise<any> {
    let image; // pre-create the image holder

    switch (typeof body) {
      case 'string':
        image = JSON.parse(body);
        break;
      case 'object':
        image = body;
        break;
    }

    // try and get the contents
    try {
      if (image) {
        const data = await this.imagesService.getExifData(image.image);
        return { data, meta: { url: image.image } };
      }
    } catch (error) {
      // if we are unable to get the EXIF data for whatever reason
      throw new UnsupportedMediaTypeException(error.message);
    }

    // If we got here, the user didn't supply an image
    throw new BadRequestException('No Image Provided');
  }
}
