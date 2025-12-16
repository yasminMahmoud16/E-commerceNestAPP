import { Body, Controller, Post,Patch } from '@nestjs/common';
import { AuthenticationService } from './auth.service';
import { ConfirmEmailDto, LoginBodyDto, ResendConfirmEmailDto, SignupBodyDto } from './dto/signup.dto';
import { IResponse, LoginCredentialsResponse, successResponse } from 'src/common';
import { LoginResponse } from './entities/auth.entity';
// @UsePipes(new ValidationPipe({
//   stopAtFirstError: true,
//   whitelist: true, // not all key just with @property
//   forbidNonWhitelisted: true, // tells me there is an extra field 
//   // dismissDefaultMessages: true, // no default message will return
//   // disableErrorMessages:true // all messages error will not show 
//   // skipUndefinedProperties:true, // if field require and user dose not sent will be undefined
//   // skipNullProperties: true, // if field require and user dose not sent will be null
//   // skipMissingProperties:true //both null and undefined 
// }))

@Controller('auth')
export class AuthenticationController {
  constructor(
    private readonly authService: AuthenticationService,
  ) { }

  // validation body / query on method 

  @Post('/signup')
  async signup(@Body() body: SignupBodyDto): Promise<IResponse> {
    console.log(body);
    await this.authService.signup(body)
    return successResponse();
  }

  @Post('/resend-confirm-email')
  async resendConfirmEmail(@Body() body: ResendConfirmEmailDto): Promise<IResponse> {
    await this.authService.resendConfirmEmail(body)
    return successResponse();
  }
  @Patch('/confirm-email')
  async confirmEmail(@Body() body: ConfirmEmailDto): Promise<IResponse> {
    await this.authService.confirmEmail(body)
    return successResponse();
  }

  @Post('/login')
  async login(@Body() body: LoginBodyDto): Promise<IResponse<LoginResponse>> {
    const credentials = await this.authService.login(body)
    return successResponse<LoginResponse>({ message: "Done", data: { credentials }})
  }
}
