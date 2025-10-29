import { DatabaseRepository } from "./database.repository";
import { TokenDocument as TDocument, Token } from "../models/token.model";
import { Model } from "mongoose";
export declare class TokenRepository extends DatabaseRepository<Token> {
    protected readonly model: Model<TDocument>;
    constructor(model: Model<TDocument>);
}
