import { DatabaseRepository } from "./database.repository";
import { CategoryDocument as TDocument, Category } from "../models";
import { Model } from "mongoose";
export declare class CategoryRepository extends DatabaseRepository<Category> {
    protected readonly model: Model<TDocument>;
    constructor(model: Model<TDocument>);
}
