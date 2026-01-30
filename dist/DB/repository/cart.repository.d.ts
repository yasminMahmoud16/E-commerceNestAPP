import { DatabaseRepository } from "./database.repository";
import { CartDocument as TDocument, Cart } from "../models";
import { Model } from "mongoose";
export declare class CartRepository extends DatabaseRepository<Cart> {
    protected readonly model: Model<TDocument>;
    constructor(model: Model<TDocument>);
}
