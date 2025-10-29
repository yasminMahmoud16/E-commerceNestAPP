import { Injectable } from "@nestjs/common";
import { DatabaseRepository } from "./database.repository";
import { TokenDocument as TDocument, Token } from "../models/token.model";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
@Injectable()
export class TokenRepository extends DatabaseRepository<Token> {
    constructor(@InjectModel("Token") protected override readonly model: Model<TDocument>) {
        super(model)
    }
}