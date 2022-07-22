import { HttpService } from '@nestjs/axios';
import {
  BadRequestException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { catchError, firstValueFrom, throwError } from 'rxjs';

@Injectable()
export class GraphqlService {
  constructor(private http: HttpService) {}

  handleError(error: any) {
    switch (error.response.status) {
      case HttpStatus.BAD_REQUEST:
        return throwError(
          () => new BadRequestException(error.response.data.errors[0].message),
        );
      case HttpStatus.UNAUTHORIZED:
        return throwError(
          () =>
            new UnauthorizedException(error.response.data.errors[0].message),
        );
      default:
        return throwError(() => new Error('unhandled exception'));
    }
  }

  // Query the GraphQL API
  query(query: string, variables?: any): Promise<any> {
    try {
      const response = this.http
        .post(
          'graphql',
          { query, variables },
          {
            headers: {
              'Content-Type': 'application/json',
              Accept: 'application/json',
            },
          },
        )
        .pipe(catchError(this.handleError));
      return firstValueFrom(response);
    } catch (error) {
      console.log('we caught an error');
      throw new BadRequestException(error);
    }
  }
}
