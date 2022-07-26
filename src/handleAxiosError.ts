import {
  BadRequestException,
  HttpStatus,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { throwError } from 'rxjs';

export function handleAxiosError(error: any) {
  switch (error.response.status) {
    case HttpStatus.BAD_REQUEST:
      return throwError(
        () => new BadRequestException(error),
        //() => new BadRequestException(error.response.data.errors[0].message),
      );
    case HttpStatus.UNAUTHORIZED:
      return throwError(
        () => new UnauthorizedException(error.response.data.errors[0].message),
      );
    case HttpStatus.INTERNAL_SERVER_ERROR:
      return throwError(
        () => new InternalServerErrorException('Fuckity fuck fuck'),
      );
    default:
      return throwError(() => new Error('unhandled exception'));
  }
}
