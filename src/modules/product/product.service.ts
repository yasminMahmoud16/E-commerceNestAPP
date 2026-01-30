import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CategoryDocument, CategoryRepository, Lean, ProductDocument, ProductRepository, UserDocument, UserRepository } from 'src/DB';
import { BrandRepository } from '../../DB/repository/brand.repository';
import { CloudService, FolderEnum, GetAllDto, IAttachment, S3Service } from 'src/common';
import { Types } from 'mongoose';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductAttachmentDto, UpdateProductDto } from './dto/update-product.dto';
import { randomUUID } from 'crypto';
// import { updateProductDto } from './dto/update-brand.dto';

@Injectable()
export class ProductService {

  constructor(
    private readonly brandRepository: BrandRepository,
    private readonly categoryRepository: CategoryRepository,
    private readonly productRepository: ProductRepository,
    private readonly userRepository: UserRepository,
    // private readonly s3Service: S3Service,
    private readonly cloudinaryService: CloudService

  ) { }
  async create(
    createProductDto: CreateProductDto,
    files: Express.Multer.File[],
    user: UserDocument): Promise<ProductDocument> {

    if (!user || !user._id) {
      throw new UnauthorizedException("User is required to create a brand");
    }



    // check category exists
    const category = await this.categoryRepository.findOne({
      filter: { _id: createProductDto.category }
    })

    if (!category) {
      throw new NotFoundException("Failed to find matching category")
    }
    // check brand exists
    const brand = await this.brandRepository.findOne({
      filter: { _id: createProductDto.brands }
    })

    if (!brand) {
      throw new NotFoundException("Failed to find matching brand")
    }
    //& calculate the sale price in save hook



    const { name, description, discount
      , mainPrice, stock
    } = createProductDto

    // const checkDuplicate = await this.productRepository.findOne({
    //   filter: { name, paranoId:false }
    // });

    // if (checkDuplicate) {
    //   throw new ConflictException(checkDuplicate.freezedAt ? "Duplicated with archived product" :"Duplicated product Name");
    // }

    // console.log({files});
    let assetFolderId = randomUUID()
    // const images: string[] = await this.s3Service.uploadFiles({ files, path: `${FolderEnum.Category}/${createProductDto.category}/${FolderEnum.Product}/${assetFolderId}`})
    const images: IAttachment[] = await this.cloudinaryService.uploadFiles({
      files,
      path: `${FolderEnum.Category}/${createProductDto.category}/${FolderEnum.Product}/${assetFolderId}`
    })

    // console.log({image});


    const [product] = await this.productRepository.create({
      data: [{
        category: category._id,
        brands: brand._id,
        name,
        description,
        discount,
        mainPrice,
        salePrice: mainPrice - mainPrice * (discount / 100),
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

  async update(productId: Types.ObjectId, updateProductDto: UpdateProductDto, user: UserDocument): Promise<ProductDocument | Lean<ProductDocument>> {

    // find the product
    const findProduct = await this.productRepository.findOne({
      filter: { _id: productId }
    })

    if (!findProduct) {
      throw new NotFoundException("there is no result match")
    }




    // check category exists
    if (updateProductDto.category) {
      const category = await this.categoryRepository.findOne({
        filter: { _id: updateProductDto.category }
      })

      if (!category) {
        throw new NotFoundException("Failed to find matching category")
      }
    }
    // check brand exists
    if (updateProductDto.brands) {
      const brand = await this.brandRepository.findOne({
        filter: { _id: updateProductDto.brands }
      })

      if (!brand) {
        throw new NotFoundException("Failed to find matching brand")
      }
    }
    //& calculate the sale price
    let salePrice = findProduct.mainPrice;
    if (updateProductDto.mainPrice || updateProductDto.discount) {
      const mainPrice = updateProductDto.mainPrice ?? findProduct.mainPrice;
      const discountPrice = updateProductDto.discount ?? findProduct.discount;
      const finalPrice = mainPrice - (mainPrice * (discountPrice / 100));
      salePrice = finalPrice > 0 ? finalPrice : 1;

    }

    const product = await this.productRepository.findOneAndUpdate({
      filter: { _id: productId },
      update: {
        ...updateProductDto,
        salePrice,
        updatedBy: user._id
      }
    })
    if (!product) {
      throw new BadRequestException("Failed to update this product resource ")
    }

    return product;
  }
  async updateAttachment(productId: Types.ObjectId, updateProductAttachmentDto: UpdateProductAttachmentDto, user: UserDocument, files?: Express.Multer.File[]): Promise<ProductDocument | Lean<ProductDocument>> {

    // find the product
    const findProduct = await this.productRepository.findOne({
      filter: { _id: productId },
      options: {
        populate: [
          {
            path: "category"
          }
        ]
      }
    })

    if (!findProduct) {
      throw new NotFoundException("there is no result match")
    }


    let attachments: IAttachment[] = [];
    if (files?.length) {
      attachments = await this.cloudinaryService.uploadFiles({
        files,
        path: `${FolderEnum.Category}/${(findProduct.category as unknown as CategoryDocument).assetFolderId}/${FolderEnum.Product}/${findProduct.assetFolderId}`
      })
    }

    const removedAttachment = [...new Set(updateProductAttachmentDto.removedAttachment ?? [])]

    const product = await this.productRepository.findOneAndUpdate({
      filter: { _id: productId },
      update: [
        {
          $set: {
            images: {
              $setUnion: [
                {
                  $setDifference: [
                    "$images",
                    removedAttachment
                  ]
                },
                attachments
              ]
            },
            updatedBy: user._id

          }
        }
      ]
    })
    if (!product) {
      await this.cloudinaryService.deleteFiles(attachments.map(img => img.public_id))
      throw new BadRequestException("Failed to update this product resource ")
    }
    await this.cloudinaryService.deleteFiles(removedAttachment)

    return product;
  }



  async softDelete(productId: Types.ObjectId, user: UserDocument): Promise<string> {




    const product = await this.productRepository.findOneAndUpdate({
      filter: {
        _id: productId
      },
      update: {
        freezedAt: new Date(),
        $unset: {
          restoredAt: true
        },
        updatedBy: user._id

      },
      options: {
        new: false
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
        freezedAt: { $exists: true }
      },
      update: {
        restoredAt: new Date(),
        $unset: {
          freezedAt: true
        },
        updatedBy: user._id

      },
      options: {
        new: false
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
        freezedAt: { $exists: true }
      }
    })


    if (!product) {
      throw new NotFoundException("Fail to find matching result")
    }
    await this.cloudinaryService.deleteFiles(
      product.images.map(img => img.public_id)
    );
    return "Done";
  }

  async findAll(data: GetAllDto, archive: boolean = false): Promise<{
    docsCount?: number,
    limit?: number,
    page?: number
    currentPage?: number | undefined,
    result: ProductDocument[] | Lean<ProductDocument>[],

  }> {
    const { page, size, search } = data
    const products = await this.productRepository.paginate({
      filter: {
        ...(search ? {
          $or: [
            { name: { $regex: search, $options: "i" } }, //case insensitive
            { slug: { $regex: search, $options: "i" } },
            { slogan: { $regex: search, $options: "i" } }
          ]
        } : {}),
        ...(archive ? { paranoId: false, freezedAt: { $exists: true } } : {})
      },
      page,
      size
    })
    return products;
  }
  async findOne(productId: Types.ObjectId, archive: boolean = false): Promise<ProductDocument | Lean<ProductDocument>> {
    const product = await this.productRepository.findOne({
      filter: {
        _id: productId,
        ...(archive ? { paranoId: false, freezedAt: { $exists: true } } : {})
      },

    })
    if (!product) {
      throw new NotFoundException("failed to find matching product")
    }
    return product;
  }

  // wishList
  async addToWishlist(productId: Types.ObjectId, user: UserDocument)
    : Promise<ProductDocument | Lean<ProductDocument>> {
    const product = await this.productRepository.findOne({
      filter: {
        _id: productId,
      },

    })
    if (!product) {
      throw new NotFoundException("failed to find matching product")
    }

    await this.userRepository.updateOne({
      filter: {
        _id:user._id
      },
      update: {
        $addToSet:{wishlist:product._id}
      }
    })
    return product;
  }
  async removeFromWishlist(productId: Types.ObjectId, user: UserDocument)
    : Promise<String> {

    await this.userRepository.updateOne({
      filter: {
        _id:user._id
      },
      update: {
        $pull:{wishlist:Types.ObjectId.createFromHexString(productId as unknown as string)}
      }
    })
    return "Done";
  }



}
