import { BadRequestException, ConflictException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { BrandRepository, CategoryDocument, CategoryRepository, Lean, UserDocument } from 'src/DB';
import { CloudService, FolderEnum, GetAllDto, IAttachment, S3Service } from 'src/common';
import { Types } from 'mongoose';
import { CreateCategoryDto } from './dto/create-category.dto';
import {  UpdateCategoryDto } from './dto/update-category.dto';
import { randomUUID } from 'crypto';
// import { updateCategoryDto } from './dto/update-brand.dto';

@Injectable()
export class CategoryService {

  constructor(
    private readonly categoryRepository: CategoryRepository,
    private readonly brandRepository: BrandRepository,
    private readonly s3Service: S3Service,
    private readonly cloudinaryService: CloudService,

  ) { }
  async create(createCategoryDto: CreateCategoryDto,
    file: Express.Multer.File,
    user: UserDocument): Promise<CategoryDocument> {
    if (!user || !user._id) {
      throw new UnauthorizedException("User is required to create a category");
    }


    const { name } = createCategoryDto

    const checkDuplicate = await this.categoryRepository.findOne({
      filter: { name, paranoId: false }
    });

    if (checkDuplicate) {
      throw new ConflictException(checkDuplicate.freezedAt ? "Duplicated with archived category" : "Duplicated category Name");
    }

    const brands: Types.ObjectId[] = [...new Set(createCategoryDto.brands || [])];
    if (brands && (await this.brandRepository.find({ filter: { _id: { $in: brands } } })).length != brands.length) {
      throw new NotFoundException("some of mentioned brands are not exists")
    }


    let assetFolderId: string = randomUUID()
    const image: IAttachment = await this.cloudinaryService.uploadFile({
      file,
      path: `${FolderEnum.Category}/${assetFolderId}`
    })
    // const image: string = await this.s3Service.uploadFile({
    //   file,
    //   path: `${FolderEnum.Category}/${assetFolderId}`
    // })

    console.log({ image });


    const [category] = await this.categoryRepository.create({
      data: [{
        ...createCategoryDto,
        image,
        assetFolderId,
        createdBy: user._id,
        brands: brands.map(brand => { return Types.ObjectId.createFromHexString(brand as unknown as string) })
      }]
    });
    console.log({ category });


    if (!category) {
      await this.cloudinaryService.deleteFile({ public_id: image.public_id })
      throw new BadRequestException("Failed to create this category resource ")
    }


    return category;
  }

  async update(
    categoryId: Types.ObjectId,
    updateCategoryDto: UpdateCategoryDto,
    user: UserDocument): Promise<CategoryDocument | Lean<CategoryDocument>> {

    // no duplicated brand name 
    if (updateCategoryDto.name && await this.categoryRepository.findOne({ filter: { name: updateCategoryDto.name } })) {
      throw new ConflictException("Duplicated category name")
    }

    const brands: Types.ObjectId[] = [...new Set(updateCategoryDto.brands || [])];
    if (brands && (await this.brandRepository.find({ filter: { _id: { $in: brands } } })).length != brands.length) {
      throw new NotFoundException("some of mentioned brands are not exists")
    }

    const removeBrands = updateCategoryDto.removeBrands ?? [];
    delete (updateCategoryDto as Partial<UpdateCategoryDto>).removeBrands;

    const category = await this.categoryRepository.findOneAndUpdate({
      filter: { _id: categoryId },
      update: [
        {
          $set: {
            ...updateCategoryDto,
            updateBy: user._id,
            brands: {
              $setUnion: [

                {
                  $setDifference: [

                    "$brands",
                    (removeBrands || []).map((brand) => {
                      return Types.ObjectId.createFromHexString(brand as unknown as string)
                    })
                  ]
                },

                brands.map((brand) => {
                  return Types.ObjectId.createFromHexString(brand as unknown as string)
                })



              ]
            }
          }
        }
      ]
    });

    if (!category) {
      throw new NotFoundException("failed to find matching brand instance ")
    }
    return category;
  }
  async updateAttachment(
    categoryId: Types.ObjectId,
    file: Express.Multer.File,
    user: UserDocument): Promise<CategoryDocument | Lean<CategoryDocument>> {


    const category = await this.categoryRepository.findOne({
      filter: { _id: categoryId },
    });

    if (!category) {
      throw new NotFoundException("failed to find matching category instance ")
    }

    const image = await this.cloudinaryService.uploadFile({
      file,
      path:`${FolderEnum.Category}/${category.assetFolderId}`
    })
    const updateCategory = await this.categoryRepository.findOneAndUpdate({
      filter: { _id: categoryId },
      update: {
        image,
        updatedBy: user._id
      },
      options: {
        new: true
      }
    });

    if (!updateCategory) {
      await this.cloudinaryService.deleteFile({ public_id: image.public_id });
      throw new NotFoundException("failed to find matching category instance ")
    }
    await this.cloudinaryService.deleteFile({ public_id: category.image.public_id })
    return updateCategory;
  }


  async softDelete(categoryId: Types.ObjectId, user: UserDocument): Promise<string> {




    const category = await this.categoryRepository.findOneAndUpdate({
      filter: {
        _id: categoryId
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

    if (!category) {
      throw new NotFoundException("Fail to find matching category")
    }
    return "category deleted successfully";
  }
  async restore(categoryId: Types.ObjectId, user: UserDocument): Promise<CategoryDocument | Lean<CategoryDocument>> {
    const category = await this.categoryRepository.findOneAndUpdate({
      filter: {
        _id: categoryId,
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

    if (!category) {
      throw new NotFoundException("Fail to find matching category")
    }
    return category;
  }
  async remove(categoryId: Types.ObjectId, user: UserDocument) {
    const category = await this.categoryRepository.findOneAndDelete({
      filter: {
        _id: categoryId,
        paranoId: false,
        freezedAt: { $exists: true }
      }
    })

    if (!category) {
      throw new NotFoundException("Fail to find matching result")
    }
    await this.cloudinaryService.deleteFile({ public_id: category.image.public_id })
    return "Done";
  }

  async findAll(data: GetAllDto, archive: boolean = false): Promise<{
    docsCount?: number,
    limit?: number,
    page?: number
    currentPage?: number | undefined,
    result: CategoryDocument[] | Lean<CategoryDocument>[],

  }> {
    const { page, size, search } = data
    const categories = await this.categoryRepository.paginate({
      filter: {
        ...(search ? {
          $or: [
            { name: { $regex: search, $options: "i" } }, //case insensitive
            { slug: { $regex: search, $options: "i" } },
            { description: { $regex: search, $options: "i" } }
          ]
        } : {}),
        ...(archive ? { paranoId: false, freezedAt: { $exists: true } } : {})
      },
      page,
      size
    })
    return categories;
  }
  async findOne(brandId: Types.ObjectId, archive: boolean = false): Promise<CategoryDocument | Lean<CategoryDocument>> {
    const brand = await this.categoryRepository.findOne({
      filter: {
        _id: brandId,
        ...(archive ? { paranoId: false, freezedAt: { $exists: true } } : {})
      },

    })
    if (!brand) {
      throw new NotFoundException("failed to find matching brand")
    }
    return brand;
  }



}
