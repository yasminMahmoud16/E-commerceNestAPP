import { Controller, Get, Headers, MaxFileSizeValidator, ParseFilePipe, Patch, Req, SetMetadata, UploadedFile, UploadedFiles, UseGuards, UseInterceptors } from '@nestjs/common';
import { UserService } from './user.service';
import {  RoleEnum, StorageEnum, successResponse, User } from 'src/common';
import type{ IMulterFile, IResponse, IUser } from 'src/common';
import { Auth } from 'src/common/decorators/auth.decorator';
import type {  UserDocument } from 'src/DB';
import { PreferredLanguageInterceptor } from 'src/common/interceptors';
import { delay, Observable, of } from 'rxjs';
import { FileFieldsInterceptor, FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { cloudFileUpload, fileValidation, localFileUpload } from 'src/common/utils/multer';
import { profileResponse } from './entities/user.entity';


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

  @UseInterceptors(
    FileInterceptor('profileImage', cloudFileUpload({
      storageApproach:StorageEnum.disk,
    validation: fileValidation.image,
    fileSize: 2
  })))
  @Auth([RoleEnum.user])
  @Patch("profile-image")
  async profileImage(

    // receive the image 
    // ParseFilePipe ::: makes the file required by default  @UploadedFile(ParseFilePipe)
    //to make it option must take new instance from it UploadedFile(new ParseFilePipe({options}))
    // pipeline  validation
    @User()user:UserDocument,
    @UploadedFile(new ParseFilePipe({
      validators: [new MaxFileSizeValidator({ maxSize: 2 * 1024 * 1024 })], fileIsRequired: true
    })) file: Express.Multer.File
    
  ): Promise<IResponse<profileResponse>> {
    const profile = await this.userService.profileImage(file, user)
    return successResponse<profileResponse>({data: { profile }});
  }


  @UseInterceptors(
    FilesInterceptor('coverImages', 2,
      localFileUpload({
    folder: "User",
    validation: fileValidation.image,
    fileSize: 2
  })))
  @Auth([RoleEnum.user])
  @Patch("cover-images")
  coverImages(
    // receive the image 
    // ParseFilePipe ::: makes the file required by default  @UploadedFile(ParseFilePipe)
    //to make it option must take new instance from it UploadedFile(new ParseFilePipe({options})) 
    // pipeline  validation
    @UploadedFiles(new ParseFilePipe({
      validators: [new MaxFileSizeValidator({ maxSize: 2 * 1024 * 1024 })], fileIsRequired: true
    })) files: Array<IMulterFile> 
    
  ) {
    return { message: 'DONE',files };
  }

  // upload with fields
  @UseInterceptors(
    FileFieldsInterceptor([{
      name: "profileImage",
      maxCount:1
    }, {
      name: "coverImages",
      maxCount:2
    }],
      localFileUpload({
    folder: "User",
    validation: fileValidation.image,
    fileSize: 2
  })))
  @Auth([RoleEnum.user])
  @Patch("images")
  images(
    // receive the image 
    // ParseFilePipe ::: makes the file required by default  @UploadedFile(ParseFilePipe)
    //to make it option must take new instance from it UploadedFile(new ParseFilePipe({options})) 
    // pipeline  validation
    @UploadedFiles(new ParseFilePipe({
      // validators: [new MaxFileSizeValidator({ maxSize: 2 * 1024 * 1024 })], fileIsRequired: true
    })) files: {
      profileImage?: Array<IMulterFile>, coverImages?: Array<IMulterFile>
    }
    
  ) {
    return { message: 'DONE',files };
  }
}
