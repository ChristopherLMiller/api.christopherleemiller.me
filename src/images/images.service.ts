import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { Prisma } from 'prisma';
import { firstValueFrom } from 'rxjs';
import { PrismaService } from 'src/prisma/prisma.service';

const ExifImage = require('exif').ExifImage;

@Injectable()
export class ImagesService {
  constructor(
    private httpService: HttpService,
    private prisma: PrismaService,
  ) {}

  async getExifData(image: string) {
    // See if the data already exists
    const exifData = await this.prisma.imageExif.findUnique({
      where: { url: image },
    });

    if (exifData) {
      // If the data wasn't null that means we got it, return that
      return exifData;
    } else {
      // Image doesn't exist in the DB, lets get that info now
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

      const data = (await promiseResponse) as Prisma.InputJsonFormat;
      return await this.prisma.imageExif.create({
        data: { url: image, exif: data },
      });
    }
  }
}
