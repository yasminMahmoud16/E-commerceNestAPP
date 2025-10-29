import { Controller, Get, Headers, Req, SetMetadata, UseGuards, UseInterceptors } from '@nestjs/common';
import { UserService } from './user.service';
import { RoleEnum, User } from 'src/common';
import { Auth } from 'src/common/decorators/auth.decorator';
import type { UserDocument } from 'src/DB';
import { PreferredLanguageInterceptor } from 'src/common/interceptors';
import { delay, Observable, of } from 'rxjs';


@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseInterceptors(PreferredLanguageInterceptor)
  @Auth([RoleEnum.admin, RoleEnum.user],)
  // @Roles([RoleEnum.user])
  // @UseGuards(AuthenticationGuard, AuthorizationGuard)
  @Get()
  profile(
    @Headers() header:any,
    @User() user:UserDocument
  ): Observable<any> {
    console.log({
      lang:header["accept-language"],
      user,
    });
    return of([{message: 'DONE'}]).pipe(delay(200))
    // return { message: 'DONE' };
  }
  @Get()
  allUsers(): { message: string } {
    return { message: 'DONE' };
  }
}
