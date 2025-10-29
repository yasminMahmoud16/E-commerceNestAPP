
import { Injectable, NestInterceptor, ExecutionContext, CallHandler, RequestTimeoutException } from '@nestjs/common';
import { Observable, throwError, TimeoutError } from 'rxjs';
import { catchError, tap, timeout } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        // time when req starts 
        console.log('Before...');

        // execution ctx to get the info
        const now = Date.now();
        return next
            .handle()
        // time when req ends 

            .pipe(
                timeout(10000),
                catchError(err => {
                    if (err instanceof TimeoutError) {
                        return throwError(() => new RequestTimeoutException());
                    }
                    return throwError(() => err);
                }),
                tap(() => console.log(`After... ${Date.now() - now}ms`)),
            );
    }
}
