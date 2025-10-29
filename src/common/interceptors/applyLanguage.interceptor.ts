
import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class PreferredLanguageInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        // time when req starts 
        console.log('Before...');

        // execution ctx to get the info
        context.switchToHttp().getRequest().headers["accept-language"] = context.switchToHttp().getRequest().credentials?.user?.preferredLanguage ?? context.switchToHttp().getRequest().headers["accept-language"];


        return next
            .handle()
        // time when req ends 

            .pipe(
                tap(() => console.log(`done`)),
            );
    }
}
