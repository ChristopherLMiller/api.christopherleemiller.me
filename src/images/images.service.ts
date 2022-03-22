import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';

const ExifImage = require('exif').ExifImage;

@Injectable()
export class ImagesService {
  constructor(private httpService: HttpService) {}

  async getExifData(image: string) {
    const imageData = await firstValueFrom(
      this.httpService.get(image, {
        responseType: 'arraybuffer',
      }),
    );

    const promiseResponse = new Promise((res, rej) => {
      new ExifImage({ image: imageData.data }, (error, exifData) => {
        if (error) {
          rej(error);
        }
        res(exifData);
      });
    });

    const exifData = await promiseResponse;
    return exifData;
  }
}
