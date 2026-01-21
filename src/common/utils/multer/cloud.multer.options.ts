import { BadRequestException } from "@nestjs/common"
import { MulterOptions } from "@nestjs/platform-express/multer/interfaces/multer-options.interface"
import type { Request } from "express"
import {  diskStorage, memoryStorage } from "multer"
import { randomUUID } from "node:crypto"
import { tmpdir } from "node:os"
import { StorageEnum } from "src/common/enums"
export const cloudFileUpload = ({
  storageApproach= StorageEnum.memory,
  validation = [],
  fileSize=10
}: {
    storageApproach?: StorageEnum
    validation: string[],
    fileSize?:number
}):MulterOptions => {
    return {
      storage:
        storageApproach === StorageEnum.memory ? memoryStorage() : diskStorage({}),
        // for validation 
      fileFilter: (req: Request, file: Express.Multer.File, callback: Function) => {
        // contain the file uploaded
        if (validation.includes(file.mimetype)) {
          return callback(null, true)
        }
        return callback(new BadRequestException("Invalid file formate "),false)
      },

      limits: {
        fileSize: fileSize * 1024 * 1024, // from bytes to (MB)
        
      }
    }
}