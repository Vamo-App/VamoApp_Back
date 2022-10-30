import { CallHandler, ExecutionContext, HttpException, HttpStatus, Injectable, NestInterceptor } from '@nestjs/common';
import { catchError, Observable } from 'rxjs';

@Injectable()
export class BusinessErrorsInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        return next.handle()
            .pipe(catchError(error => {
                if (error.httpStatus !== undefined)
                    throw new HttpException(error.message, error.httpStatus);
                /*else if (error.code !== undefined) {
                    if (error.code === '23505')
                        throw new HttpException(`[SQL 23505] The value ${error.detail.split('=')[1]} is already in use`, HttpStatus.CONFLICT);
                    else if (error.code === '23503')
                        throw new HttpException(`[SQL 23503] The value (${error.detail}) does not exist`, HttpStatus.NOT_FOUND);
                    else if (error.code === '23502')
                        throw new HttpException(`[SQL 23502] The value (${error.detail}) is required`, HttpStatus.BAD_REQUEST);
                    else
                        throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
                }*/
                if (error.code)
                    throw new HttpException(`Internal server error [${error.code}]: ${error.detail ? error.detail : error.message}`, HttpStatus.INTERNAL_SERVER_ERROR);
                else
                    throw error;
            }));
    }
}