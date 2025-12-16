import { BadRequestException } from "@nestjs/common"
import { MulterOptions } from "@nestjs/platform-express/multer/interfaces/multer-options.interface"
import type { Request } from "express"
import { diskStorage } from "multer"
import { randomUUID } from "node:crypto"
import { existsSync, mkdirSync } from "node:fs"
import path from "node:path"
import type { IMulterFile } from "src/common/interfaces"
export const localFileUpload = ({
  folder = "public",
  validation = [],
  fileSize=2
}: {
    folder?: string,
    validation: string[],
    fileSize?:number
}):MulterOptions => {
    let basePath = `upload/${folder}`
    return {
        storage: diskStorage({
          destination(req:Request, file:Express.Multer.File, callback:Function) {
                const fullPath = path.resolve(`./${basePath}`);
                if (!existsSync(fullPath)) {
                    mkdirSync(fullPath,{recursive:true})
                }
                callback(null, fullPath)
          },
            filename(req: Request, file: IMulterFile, callback:Function) {
            const fileName = randomUUID()+"_"+Date.now()+"_"+file.originalname
            file.finalPath= basePath+`/${fileName}`
              callback(null, fileName)
          },

        }),
      
        // for validation 
      fileFilter: (req: Request, file: Express.Multer.File, callback: Function) => {
        // contain the file uploaded
        if (validation.includes(file.mimetype)) {
          return callback(null, true)
        }
        return callback(new BadRequestException("Invalid file formate "))
      },

      limits: {
        fileSize: fileSize * 1024 * 1024, // from bytes to (MB)
      }
    }
}