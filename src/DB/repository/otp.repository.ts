import { Injectable } from "@nestjs/common";
import { DatabaseRepository } from "./database.repository";
import { OtpDocument as TDocument, Otp } from "../models";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
@Injectable()
export class OtpRepository extends DatabaseRepository<Otp>{
    constructor(@InjectModel("Otp") protected override readonly model:Model<TDocument>) {
        super(model)
    }
}