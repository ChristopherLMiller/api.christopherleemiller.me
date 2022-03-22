import { Body, Controller, Post } from '@nestjs/common';
import { ImagesService } from './images.service';

@Controller('images')
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
        return {
          status: 'success',
          data,
        };
      }
    } catch (error) {
      console.log(error);
      return {
        status: 'error',
        message: error.message,
      };
    }

    return {
      status: 'error',
      message: 'No image provided',
    };
  }
}
