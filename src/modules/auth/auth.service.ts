import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import {  Types } from 'mongoose';
import {  UserDocument } from 'src/DB/models';
import { ConfirmEmailDto, LoginBodyDto, ResendConfirmEmailDto, SignupBodyDto } from './dto/signup.dto';
import { OtpRepository, UserRepository } from 'src/DB';
import { compareHash, createNumericalOtp, generateHash, LoginCredentialsResponse, OtpEnum, ProviderEnum } from 'src/common';
import { TokenService } from 'src/common/services';

@Injectable()
export class AuthenticationService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly otpRepository: OtpRepository,
    private readonly tokenService: TokenService

  ) { }
  
  private async createConfirmEmailOtp(userId:Types.ObjectId) {
    await this.otpRepository.create({
      data: [{
        code: createNumericalOtp(),
        expiredAt: new Date(Date.now() + 2 * 60 * 1000),
        createdBy: userId,
        type: OtpEnum.ConfirmEmail
      }]
    })
}
  async signup(data: SignupBodyDto):Promise<string>{
    const { email, password, username , gender } = data
    const checkUserExist = await this.userRepository.findOne({ filter: { email } })
    if (checkUserExist) {
      throw new ConflictException("Email already exist")
    };

    const [user] = await this.userRepository.create({
      data: [
        { username, email, password:await generateHash(password), gender }
      ]
    }
    );

    if (!user) {
      throw new BadRequestException("Failed to signup please try again later")
    };


    await this.createConfirmEmailOtp(user._id);
    // emailEvent.emit("confirmEmail", { to: email, otp: otp.code })
    return "Done"
  }
  async resendConfirmEmail(data: ResendConfirmEmailDto):Promise<string>{
    const { email } = data
    const user = await this.userRepository.findOne({
      filter:
        { email, confirmedAt: { $exists: false } },
      options:
        {
        populate: [{
          path: "otp",
          match: {
            type: OtpEnum.ConfirmEmail
          }
        }] 
        }
        
    });

    console.log({user});
    
    if (!user) {
      throw new NotFoundException("Failed to find matching account")
    };

    if (user.otp?.length) {
      throw new ConflictException(`Sorry we can not grand new otp until the existing one become expired please try again after${user.otp[0].expiredAt.toLocaleString() }`)
    }


    await this.createConfirmEmailOtp(user._id);

    return "Done"
  }
  async confirmEmail(data: ConfirmEmailDto):Promise<string>{
    const { email, code } = data;
    const user = await this.userRepository.findOne({
      filter:
        { email, confirmedAt: { $exists: false } },
      options:
        {
        populate: [{
          path: "otp",
          match: {
            type: OtpEnum.ConfirmEmail
          }
        }] 
        }
        
    });

    console.log({user});
    
    if (!user) {
      throw new NotFoundException("Failed to find matching account")
    };

    if (!(user.otp?.length && await compareHash(code, user.otp[0].code))) {
      throw new BadRequestException("In-valid otp")
    };


    user.confirmedAt = new Date();
    await user.save();
    await this.otpRepository.deleteOne({filter:{_id:user.otp[0]._id}})
    return "Done"
  }


  async login(data: LoginBodyDto): Promise<LoginCredentialsResponse> {
    const { email, password  } = data
    const user = await this.userRepository.findOne({
      filter: {
        email,
        confirmedAt: { $exists: true },
        provider: ProviderEnum.SYSTEM
      }
    });
    console.log({user});
    
    if (!user) {
      throw new NotFoundException("Failed to find matching account")
    };


    if (!(await compareHash(password, user.password))) {
      throw new NotFoundException("Failed to find matching account compare")
    };






    return await this.tokenService.createLoginCredentials(user as UserDocument)
  }
}
