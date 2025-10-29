import { Body, Controller, Post,Patch } from '@nestjs/common';
import { AuthenticationService } from './auth.service';
import { ConfirmEmailDto, LoginBodyDto, ResendConfirmEmailDto, SignupBodyDto } from './dto/signup.dto';
import { LoginCredentialsResponse } from 'src/common';
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
  async signup(@Body() body: SignupBodyDto): Promise<{ message: string }> {
    console.log(body);
    await this.authService.signup(body)
    return { message: 'Done' };
  }

  @Post('/resend-confirm-email')
  async resendConfirmEmail(@Body() body: ResendConfirmEmailDto): Promise<{ message: string }> {
    await this.authService.resendConfirmEmail(body)
    return { message: 'Done' };
  }
  @Patch('/confirm-email')
  async confirmEmail(@Body() body: ConfirmEmailDto): Promise<{ message: string }> {
    await this.authService.confirmEmail(body)
    return { message: 'Done' };
  }

  @Post('/login')
  async login(@Body() body: LoginBodyDto): Promise<LoginResponse> {
    const credentials = await this.authService.login(body)
    return { message: "Done", data: { credentials }}
  }
}
