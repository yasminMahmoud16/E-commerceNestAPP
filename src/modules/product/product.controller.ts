import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile, ParseFilePipe, UsePipes, ValidationPipe, Query, UploadedFiles } from '@nestjs/common';
import { Auth, IResponse, successResponse, User } from 'src/common';
import type { UserDocument } from 'src/DB';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { cloudFileUpload, fileValidation } from 'src/common/utils/multer';
import { ProductService } from './product.service';
import { endPoint } from './product.authorization.module';
import { CreateProductDto } from './dto/create-product.dto';
import { GetAllResponse, ProductResponse } from './entities/product.entity';
import { GetAllDto, ProductParamDto, UpdateProductDto } from './dto/update-product.dto';


@UsePipes(new ValidationPipe({whitelist:true,forbidNonWhitelisted:true}))
@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @UseInterceptors(FilesInterceptor("attachments",5, cloudFileUpload({ validation: fileValidation.image })))
  @Auth(endPoint.create)
  @Post()
  async create(
    @User() user: UserDocument,
    @Body() createProductDto: CreateProductDto,
    // @UploadedFile() file:Express.Multer.File
    @UploadedFiles(ParseFilePipe) files:Express.Multer.File[]
  ): Promise<IResponse<ProductResponse>> {
    const product = await this.productService.create(createProductDto, files, user);
    return successResponse<ProductResponse>({ status: 201, data: { product }})
  }


  @Auth(endPoint.create)
  @Patch(':productId')
  async update(@Param() params: ProductParamDto,
    @Body() updateProductDto: UpdateProductDto,
    @User()user:UserDocument
  ): Promise<IResponse<ProductResponse>> {

    const product = await this.productService.update(params.productId, updateProductDto, user);
    return successResponse<ProductResponse>({data:{product}})
  }


  @UseInterceptors(FileInterceptor("attachment", cloudFileUpload({
    validation:fileValidation.image
  })))
  @Auth(endPoint.create)
  @Patch(':productId/attachment')
  async updateAttachment(
    @Param() params: ProductParamDto,
    @UploadedFile(ParseFilePipe) file:Express.Multer.File,
    @User()user:UserDocument
  ): Promise<IResponse<ProductResponse>> {

    const product = await this.productService.updateAttachment(params.productId, file, user);
    return successResponse<ProductResponse>({data:{product}})
  }

  @Get()
  async findAll(
    @Query() query:GetAllDto
  ): Promise<IResponse<GetAllResponse>> {
    const result  = await this.productService.findAll(query);
    return successResponse<GetAllResponse>({data:{result}})
  }

  @Auth(endPoint.create)
  @Get("archive")
  async findAllArchiveBrand(
    @Query() query:GetAllDto
  ): Promise<IResponse<GetAllResponse>> {
    const result  = await this.productService.findAll(query, true);
    return successResponse<GetAllResponse>({data:{result}})
  }

  @Get(':productId')
  async findOne(@Param() params: ProductParamDto) {
    const product = await this.productService.findOne(params.productId);
    return successResponse<ProductResponse>({data:{product}})
  }

  @Auth(endPoint.create)
  @Get(':productId/archive')
  async findOneArchive(@Param() params: ProductParamDto) {
    const product = await this.productService.findOne(params.productId, true);
    return successResponse<ProductResponse>({ data: { product } })
  }

  @Auth(endPoint.create)
  @Delete(':productId/freeze')
  async softDelete(
    @Param() params: ProductParamDto,
    @User() user:UserDocument
  ): Promise<IResponse> {
    await this.productService.softDelete(params.productId, user)
    return successResponse();
  }

  @Auth(endPoint.create)
  @Patch(':productId/restore')
  async restore(
    @Param() params: ProductParamDto,
    @User() user:UserDocument
  ): Promise<IResponse> {
   const product= await this.productService.restore(params.productId, user)
    return successResponse<ProductResponse>({data:{product}});
  }

  @Auth(endPoint.create)
  @Delete(':productId/hard-delete')
  async remove(
    @Param() params: ProductParamDto,
    @User() user: UserDocument) {
      await this.productService.remove(params.productId, user);
    return successResponse();
  }
}
