import { BadRequestException, Controller, Get, Param, Query, Res } from '@nestjs/common';
import { AppService } from './app.service';
// import { S3Service } from './common';
import type { Response } from 'express';
// import { S3Service } from './common';
import { promisify } from "node:util";
import { pipeline } from "node:stream";
import { S3Service } from './common';

const createWriteStreamPip = promisify(pipeline) //return pipeline with async/await 
// localhost:3000/
@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly s3Service: S3Service
  ) { }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('/upload/pre-signed/*path')
  async getPreSignedAssetsUrl(
    @Query() query : { downloadName?: string, download?: string, expiresIn?: number },
    @Param() params: { path: string[] }
  ) {
    const {
      downloadName,
      download = "false",
      expiresIn = 120 } = query ;
    const { path } = params 
    // console.log({path});

    const Key = path.join('/')

    const url = await this.s3Service.createGetPreSignedLink({
      Key,
      downloadName: downloadName as string,
      download,
      expiresIn
    });
    // console.log({url});

    return { message: "Done", data: { url } }
  }
  @Get('/upload/*path')
  async getAssets(
    @Query() query : { downloadName?: string, download?: string, expiresIn?: number },
    @Param() params: { path: string[] },
    @Res({passthrough:true})res:Response
  ) {
    const {
      downloadName,
      download = "false",
      expiresIn = 120
    } = query;
    const { path } = params 
    // console.log({path});

    const Key = path.join('/')
      const s3Response = await this.s3Service.getFile({ Key });
      // console.log(s3Response.Body);
      if (!s3Response?.Body) {
        throw new BadRequestException("fail to fetch this asset")
      };
      // res.set("Cross-Origin-Resources-Policy", "cross-origin");
      res.set("Cross-Origin-Resource-Policy", "cross-origin");

      res.setHeader("Content-type", `${s3Response.ContentType || "application/octet-stream"}`);
      if (download === "true") {

        res.setHeader("Content-Disposition", `attachment; filename="${downloadName || Key.split("/").pop()}"`); //download
      }
      return await createWriteStreamPip(s3Response.Body as NodeJS.ReadableStream, res)

  }
  
  


}
