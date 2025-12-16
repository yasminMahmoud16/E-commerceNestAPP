import { DatabaseRepository } from "./database.repository";
import { BrandDocument as TDocument, Brand } from "../models";
import { Model } from "mongoose";
export declare class BrandRepository extends DatabaseRepository<Brand> {
    protected readonly model: Model<TDocument>;
    constructor(model: Model<TDocument>);
}
