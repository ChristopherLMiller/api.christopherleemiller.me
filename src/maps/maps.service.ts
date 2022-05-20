import { Injectable } from '@nestjs/common';
import { PinoLogger } from 'nestjs-pino';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class MapsService {
  constructor(
    private prisma: PrismaService,
    private readonly logger: PinoLogger,
  ) {}

  findMapMarkers(): any {
    return this.prisma.marker.findMany();
  }

  createMapMarker(data: any): any {
    return this.prisma.marker.create({ data });
  }
}
