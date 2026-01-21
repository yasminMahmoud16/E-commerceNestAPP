import { BadRequestException, ConflictException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateBrandDto } from './dto/create-brand.dto';
import {  Lean, UserDocument } from 'src/DB';
import { BrandDocument } from '../../DB/models/brand.model';
import { BrandRepository } from '../../DB/repository/brand.repository';
import { CloudService, FolderEnum, GetAllDto, IAttachment, S3Service } from 'src/common';
import { Types } from 'mongoose';
import {  UpdateBrandDto } from './dto/update-brand.dto';
import { randomUUID } from 'node:crypto';
// import { UpdateBrandDto } from './dto/update-brand.dto';

@Injectable()
export class BrandService {

  constructor(
    private readonly brandRepository: BrandRepository,
    private readonly s3Service: S3Service,
    private readonly cloudinaryService: CloudService,
    
  ){}
  async create(createBrandDto: CreateBrandDto, file: Express.Multer.File, user: UserDocument): Promise<BrandDocument> {
    
    if (!user || !user._id) {
      throw new UnauthorizedException("User is required to create a brand");
    }


    const { name, slogan } = createBrandDto

    const checkDuplicate = await this.brandRepository.findOne({
      filter: { name, paranoId:false }
    });

    if (checkDuplicate) {
      throw new ConflictException(checkDuplicate.freezedAt?"Duplicated with archived brand":"Duplicated Brand Name");
    }

    console.log({file});
    // const image: string = await this.s3Service.uploadFile({file, path:"Brand"})
    let assetFolderId: string = randomUUID()
    const image: IAttachment = await this.cloudinaryService.uploadFile({
          file,
      path: `${FolderEnum.Brand}/${assetFolderId}`,
      // timeout: 120000
        })

    console.log({image});
    

    const [brand] = await this.brandRepository.create({
      data: [{
        name,
        slogan,
        image,
        createdBy: user._id
      }]
    });
    console.log({brand});
    

    if (!brand) {
      await this.cloudinaryService.deleteFile({ public_id: image.public_id })
      // await this.s3Service.deleteFile({ Key: image })
      throw new BadRequestException("Failed to create this brand resource")
    }


    return brand;
  }

  async update(brandId: Types.ObjectId, updateBrandDto: UpdateBrandDto, user:UserDocument):Promise<BrandDocument | Lean<BrandDocument>> {

    // no duplicated brand name 
    if (updateBrandDto.name && await this.brandRepository.findOne({ filter: { name: updateBrandDto.name } })) {
      throw new ConflictException("Duplicated brand name")
    }

    const brand = await this.brandRepository.findOneAndUpdate({
      filter: { _id: brandId },
      update: {
        ...updateBrandDto,
        updatedBy: user._id
      }
    });

    if (!brand) {
      throw new NotFoundException("failed to find matching brand instance ")
    }
    return brand;
  }
  async updateAttachment(
    brandId: Types.ObjectId,
    file: Express.Multer.File,
    user: UserDocument): Promise<BrandDocument | Lean<BrandDocument>> {


    const image = await this.cloudinaryService.uploadFile({file, path:FolderEnum.Brand})
    const brand = await this.brandRepository.findOneAndUpdate({
      filter: { _id: brandId },
      update: {
        image,
        updatedBy: user._id
      },
      options: {
        new :false
      }
    });

    if (!brand) {
      await this.cloudinaryService.deleteFile({ public_id: image.public_id });
      throw new NotFoundException("failed to find matching brand instance ")
    }
    await this.cloudinaryService.deleteFile({ public_id: brand.image.public_id })
    brand.image.public_id = image.public_id;
    return brand;
  }


  async softDelete(brandId: Types.ObjectId, user: UserDocument):Promise<string> {
    



    const brand = await this.brandRepository.findOneAndUpdate({
      filter: {
        _id:brandId
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

    if (!brand) {
      throw new NotFoundException("Fail to find matching brand")
    }
    return "Brand deleted successfully";
  }
  async restore(brandId: Types.ObjectId, user: UserDocument): Promise<BrandDocument | Lean<BrandDocument>> {
    



    const brand = await this.brandRepository.findOneAndUpdate({
      filter: {
        _id: brandId,
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

    if (!brand) {
      throw new NotFoundException("Fail to find matching brand")
    }
    return brand;
  }
  async remove(brandId: Types.ObjectId, user: UserDocument) {
    const brand = await this.brandRepository.findOneAndDelete({
      filter: {
        _id: brandId,
        paranoId: false,
        freezedAt:{$exists:true}
      }
    })

    if (!brand) {
      throw new NotFoundException("Fail to find matching result")
    }
    await this.cloudinaryService.deleteFile({ public_id: brand.image.public_id })
    return "Done";
  }

  async findAll(data: GetAllDto, archive: boolean=false): Promise<{
    docsCount?: number,
    limit?: number,
    page?: number
    currentPage?: number | undefined,
    result: BrandDocument[] | Lean<BrandDocument>[],
    
  }> {
    const {page,size,search}= data
    const brands = await this.brandRepository.paginate({
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
    return brands;
  }
  async findOne(brandId: Types.ObjectId, archive: boolean=false): Promise<BrandDocument | Lean<BrandDocument>> {
    const brand = await this.brandRepository.findOne({
      filter: {
        _id:brandId,
        ...(archive ? { paranoId: false, freezedAt: { $exists: true } } : {})
      },

    })
    if (!brand) {
      throw new NotFoundException("failed to find matching brand")
    }
    return brand;
  }



}
