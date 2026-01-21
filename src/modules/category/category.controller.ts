import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile, ParseFilePipe, UsePipes, ValidationPipe, Query } from '@nestjs/common';
import { Auth, GetAllDto, GetAllResponse, ICategory, IResponse, StorageEnum, successResponse, User } from 'src/common';
import type { UserDocument } from 'src/DB';
import { FileInterceptor } from '@nestjs/platform-express';
import { cloudFileUpload, fileValidation } from 'src/common/utils/multer';
import { endPoint } from './category.authorization.module';
import { CategoryService } from './category.service';
import { CategoryResponse } from './entities/category.entity';
import { CreateCategoryDto } from './dto/create-category.dto';
import { CategoryParamDto,  UpdateCategoryDto } from './dto/update-category.dto';


@UsePipes(new ValidationPipe({whitelist:true,forbidNonWhitelisted:true}))
@Controller('category')
export class CategoryController {
  constructor(
    private readonly categoryService: CategoryService,
  ) { }

  @UseInterceptors(
    FileInterceptor("attachment", cloudFileUpload({
    storageApproach:StorageEnum.disk,
    validation: fileValidation.image
  })))
  @Auth(endPoint.create)
  @Post()
  async create(
    @User() user: UserDocument,
    @Body() createCategoryDto: CreateCategoryDto,
    @UploadedFile() file:Express.Multer.File
  ): Promise<IResponse<CategoryResponse>> {
    const category =await this.categoryService.create(createCategoryDto, file, user);
    return successResponse<CategoryResponse>({ status: 201, data: { category }})
  }


  @Auth(endPoint.create)
  @Patch(':categoryId')
  async update(@Param() params: CategoryParamDto,
    @Body() updateCategoryDto: UpdateCategoryDto,
    @User()user:UserDocument
  ): Promise<IResponse<CategoryResponse>> {

    const category = await this.categoryService.update(params.categoryId, updateCategoryDto, user);
    return successResponse<CategoryResponse>({ data: { category }})
  }


  @UseInterceptors(FileInterceptor("attachment", cloudFileUpload({
    validation:fileValidation.image
  })))
  @Auth(endPoint.create)
  @Patch(':categoryId/attachment')
  async updateAttachment(
    @Param() params: CategoryParamDto,
    @UploadedFile(ParseFilePipe) file:Express.Multer.File,
    @User()user:UserDocument
  ): Promise<IResponse<CategoryResponse>> {

    const category = await this.categoryService.updateAttachment(params.categoryId, file, user);
    return successResponse<CategoryResponse>({data:{category}})
  }

  @Get()
  async findAll(
    @Query() query:GetAllDto
  ): Promise<IResponse<GetAllResponse<ICategory>>> {
    const result  = await this.categoryService.findAll(query);
    return successResponse<GetAllResponse<ICategory>>({data:{result}})
  }

  @Auth(endPoint.create)
  @Get("archive")
  async findAllArchiveBrand(
    @Query() query:GetAllDto
  ): Promise<IResponse<GetAllResponse<ICategory>>> {
    const result  = await this.categoryService.findAll(query, true);
    return successResponse<GetAllResponse<ICategory>>({data:{result}})
  }

  @Get(':categoryId')
  async findOne(@Param() params: CategoryParamDto) {
    const category = await this.categoryService.findOne(params.categoryId);
    return successResponse<CategoryResponse>({data:{category}})
  }

  @Auth(endPoint.create)
  @Get(':categoryId/archive')
  async findOneArchive(@Param() params: CategoryParamDto) {
    const category = await this.categoryService.findOne(params.categoryId, true);
    return successResponse<CategoryResponse>({ data: { category } })
  }

  @Auth(endPoint.create)
  @Delete(':categoryId/freeze')
  async softDelete(
    @Param() params: CategoryParamDto,
    @User() user:UserDocument
  ): Promise<IResponse> {
    await this.categoryService.softDelete(params.categoryId, user)
    return successResponse();
  }

  @Auth(endPoint.create)
  @Patch(':categoryId/restore')
  async restore(
    @Param() params: CategoryParamDto,
    @User() user:UserDocument
  ): Promise<IResponse> {
   const category= await this.categoryService.restore(params.categoryId, user)
    return successResponse<CategoryResponse>({data:{category}});
  }

  @Auth(endPoint.create)
  @Delete(':categoryId/hard-delete')
  async remove(
    @Param() params: CategoryParamDto,
    @User() user: UserDocument) {
      await this.categoryService.remove(params.categoryId, user);
    return successResponse();
  }
}
