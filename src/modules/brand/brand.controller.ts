import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile, ParseFilePipe, UsePipes, ValidationPipe, Query } from '@nestjs/common';
import { BrandService } from './brand.service';
import { CreateBrandDto } from './dto/create-brand.dto';
import { Auth, IResponse, successResponse, User } from 'src/common';
import type { UserDocument } from 'src/DB';
import { FileInterceptor } from '@nestjs/platform-express';
import { cloudFileUpload, fileValidation } from 'src/common/utils/multer';
import { BrandResponse, GetAllResponse } from './entities/brand.entity';
import { endPoint } from './brand.authorization.module';
import { BrandParamDto, GetAllDto } from './dto/update-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
import { Types } from 'mongoose';


@UsePipes(new ValidationPipe({whitelist:true,forbidNonWhitelisted:true}))
@Controller('brand')
export class BrandController {
  constructor(private readonly brandService: BrandService) {}

  @UseInterceptors(FileInterceptor("attachment", cloudFileUpload({ validation: fileValidation.image })))
  @Auth(endPoint.create)
  @Post()
  async create(
    @User() user: UserDocument,
    @Body() createBrandDto: CreateBrandDto,
    @UploadedFile() file:Express.Multer.File
  ): Promise<IResponse<BrandResponse>> {
    const brand =await this.brandService.create(createBrandDto, file, user);
    return successResponse<BrandResponse>({status:201, data:{brand}})
  }


  @Auth(endPoint.create)
  @Patch(':brandId')
  async update(@Param() params: BrandParamDto,
    @Body() updateBrandDto: UpdateBrandDto,
    @User()user:UserDocument
  ): Promise<IResponse<BrandResponse>> {

    const brand = await this.brandService.update(params.brandId, updateBrandDto, user);
    return successResponse<BrandResponse>({data:{brand}})
  }


  @UseInterceptors(FileInterceptor("attachment", cloudFileUpload({
    validation:fileValidation.image
  })))
  @Auth(endPoint.create)
  @Patch(':brandId/attachment')
  async updateAttachment(
    @Param() params: BrandParamDto,
    @UploadedFile(ParseFilePipe) file:Express.Multer.File,
    @User()user:UserDocument
  ): Promise<IResponse<BrandResponse>> {

    const brand = await this.brandService.updateAttachment(params.brandId, file, user);
    return successResponse<BrandResponse>({data:{brand}})
  }

  @Get()
  async findAll(
    @Query() query:GetAllDto
  ): Promise<IResponse<GetAllResponse>> {
    const result  = await this.brandService.findAll(query);
    return successResponse<GetAllResponse>({data:{result}})
  }

  @Auth(endPoint.create)
  @Get("archive")
  async findAllArchiveBrand(
    @Query() query:GetAllDto
  ): Promise<IResponse<GetAllResponse>> {
    const result  = await this.brandService.findAll(query, true);
    return successResponse<GetAllResponse>({data:{result}})
  }

  @Get(':brandId')
  async findOne(@Param() params: BrandParamDto) {
    const brand = await this.brandService.findOne(params.brandId);
    return successResponse<BrandResponse>({data:{brand}})
  }

  @Auth(endPoint.create)
  @Get(':brandId/archive')
  async findOneArchive(@Param() params: BrandParamDto) {
    const brand = await this.brandService.findOne(params.brandId, true);
    return successResponse<BrandResponse>({ data: { brand } })
  }

  @Auth(endPoint.create)
  @Delete(':brandId/freeze')
  async softDelete(
    @Param() params: BrandParamDto,
    @User() user:UserDocument
  ): Promise<IResponse> {
    await this.brandService.softDelete(params.brandId, user)
    return successResponse();
  }

  @Auth(endPoint.create)
  @Patch(':brandId/restore')
  async restore(
    @Param() params: BrandParamDto,
    @User() user:UserDocument
  ): Promise<IResponse> {
   const brand= await this.brandService.restore(params.brandId, user)
    return successResponse<BrandResponse>({data:{brand}});
  }

  @Auth(endPoint.create)
  @Delete(':brandId/hard-delete')
  async remove(
    @Param() params: BrandParamDto,
    @User() user: UserDocument) {
      await this.brandService.remove(params.brandId, user);
    return successResponse();
  }
}
