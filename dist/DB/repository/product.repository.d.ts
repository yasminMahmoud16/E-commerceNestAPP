import { DatabaseRepository } from "./database.repository";
import { ProductDocument as TDocument, Product } from "../models";
import { Model } from "mongoose";
export declare class ProductRepository extends DatabaseRepository<Product> {
    protected readonly model: Model<TDocument>;
    constructor(model: Model<TDocument>);
}
