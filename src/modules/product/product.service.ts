import { BadRequestException, ConflictException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import {  CategoryRepository, Lean, ProductDocument, ProductRepository, UserDocument } from 'src/DB';
import { BrandRepository } from '../../DB/repository/brand.repository';
import { FolderEnum, S3Service } from 'src/common';
import { Types } from 'mongoose';
import { CreateProductDto } from './dto/create-product.dto';
import { GetAllDto, UpdateProductDto } from './dto/update-product.dto';
import { CreateCategoryDto } from '../category/dto/create-category.dto';
import { randomUUID } from 'crypto';
// import { updateProductDto } from './dto/update-brand.dto';

@Injectable()
export class ProductService {

  constructor(
    private readonly brandRepository: BrandRepository,
    private readonly categoryRepository: CategoryRepository,
    private readonly productRepository: ProductRepository,
    private readonly s3Service: S3Service,
    
  ){}
  async create(
    createProductDto: CreateProductDto,
    files: Express.Multer.File[],
    user: UserDocument): Promise<ProductDocument> {
    if (!user || !user._id) {
      throw new UnauthorizedException("User is required to create a brand");
    }


    console.log({d:createProductDto});
    
    // check category exists
    const category = await this.categoryRepository.findOne({
      filter:{_id:createProductDto.category}
    })

    if (!category) {
      throw new NotFoundException("Failed to find matching category")
    }
    // check brand exists
    const brand = await this.brandRepository.findOne({
      filter:{_id:createProductDto.brands}
    })

    if (!brand) {
      throw new NotFoundException("Failed to find matching brand")
    }
    //& calculate the sale price in save hook

    

    const {  name, description, discount
      ,mainPrice, stock
     } = createProductDto

    // const checkDuplicate = await this.productRepository.findOne({
    //   filter: { name, paranoId:false }
    // });

    // if (checkDuplicate) {
    //   throw new ConflictException(checkDuplicate.freezedAt ? "Duplicated with archived product" :"Duplicated product Name");
    // }

    // console.log({files});
    let assetFolderId = randomUUID()
    const images: string[] = await this.s3Service.uploadFiles({ files, path: `${FolderEnum.Category}/${createProductDto.category}/${FolderEnum.Product}/${assetFolderId}`})

    // console.log({image});
    

    const [product] = await this.productRepository.create({
      data: [{
        category: category._id,
        brands:brand._id,
        name,
        description,
        discount,
        mainPrice,
        salePrice: mainPrice - mainPrice * (discount  / 100),
        stock,
        assetFolderId,
        images,
        createdBy: user._id
      }]
    });
    // console.log({product});
    

    if (!product) {
      throw new BadRequestException("Failed to create this product resource ")
    }


    return product;
  }

  async update(productId: Types.ObjectId, updateProductDto: UpdateProductDto, user:UserDocument):Promise<ProductDocument | Lean<ProductDocument>> {

    // no duplicated brand name 
    if (updateProductDto.name && await this.productRepository.findOne({ filter: { name: updateProductDto.name } })) {
      throw new ConflictException("Duplicated brand name")
    }

    const product = await this.productRepository.findOneAndUpdate({
      filter: { _id: productId },
      update: {
        ...updateProductDto,
        updatedBy: user._id
      }
    });

    if (!product) {
      throw new NotFoundException("failed to find matching product instance ")
    }
    return product;
  }


  async updateAttachment(
    productId: Types.ObjectId,
    file: Express.Multer.File,
    user: UserDocument): Promise<ProductDocument | Lean<ProductDocument>> {


    const image = await this.s3Service.uploadFile({file, path:FolderEnum.Brand})
    const product = await this.productRepository.findOneAndUpdate({
      filter: { _id: productId },
      update: {
        image,
        updatedBy: user._id
      },
      options: {
        new :false
      }
    });

    if (!product) {
      await this.s3Service.deleteFile({Key:image})
      throw new NotFoundException("failed to find matching product instance ")
    }
    await this.s3Service.deleteFile({ Key: product.image })
    product.image = image;
    return product;
  }


  async softDelete(productId: Types.ObjectId, user: UserDocument):Promise<string> {
    



    const product = await this.productRepository.findOneAndUpdate({
      filter: {
        _id:productId
      },
      update: {
        freezedAt: new Date(),
        $unset: {
          restoredAt:true
        },
        updatedBy:user._id

      },
      options: {
        new:false
      }
    })

    if (!product) {
      throw new NotFoundException("Fail to find matching product")
    }
    return "Product deleted successfully";
  }
  async restore(productId: Types.ObjectId, user: UserDocument): Promise<ProductDocument | Lean<ProductDocument>> {
    



    const product = await this.productRepository.findOneAndUpdate({
      filter: {
        _id: productId,
        paranoId: false,
        freezedAt:{$exists:true}
      },
      update: {
        restoredAt: new Date(),
        $unset: {
          freezedAt:true
        },
        updatedBy:user._id

      },
      options: {
        new:false
      }
    })

    if (!product) {
      throw new NotFoundException("Fail to find matching product")
    }
    return product;
  }
  async remove(productId: Types.ObjectId, user: UserDocument) {
    const product = await this.productRepository.findOneAndDelete({
      filter: {
        _id: productId,
        paranoId: false,
        freezedAt:{$exists:true}
      }
    })

    if (!product) {
      throw new NotFoundException("Fail to find matching result")
    }
    await this.s3Service.deleteFile({Key:product.image})
    return "Done";
  }

  async findAll(data: GetAllDto, archive: boolean=false): Promise<{
    docsCount?: number,
    limit?: number,
    page?: number
    currentPage?: number | undefined,
    result: ProductDocument[] | Lean<ProductDocument>[],
    
  }> {
    const {page,size,search}= data
    const products = await this.productRepository.paginate({
      filter: {
        ...(search ? {
          $or: [
            {name:{$regex:search, $options:"i"}}, //case insensitive
            {slug:{$regex:search, $options:"i"}}, 
            {slogan:{$regex:search, $options:"i"}} 
          ]
        } : {}),
        ...(archive?{paranoId:false, freezedAt:{$exists:true}}:{})
      },
      page,
      size
    })
    return products;
  }
  async findOne(productId: Types.ObjectId, archive: boolean=false): Promise<ProductDocument | Lean<ProductDocument>> {
    const product = await this.productRepository.findOne({
      filter: {
        _id:productId,
        ...(archive ? { paranoId: false, freezedAt: { $exists: true } } : {})
      },

    })
    if (!product) {
      throw new NotFoundException("failed to find matching product")
    }
    return product;
  }



}
