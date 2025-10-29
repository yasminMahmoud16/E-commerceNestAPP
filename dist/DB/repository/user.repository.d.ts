import { DatabaseRepository } from "./database.repository";
import { UserDocument as TDocument, User } from "../models";
import { Model } from "mongoose";
export declare class UserRepository extends DatabaseRepository<User> {
    protected readonly model: Model<TDocument>;
    constructor(model: Model<TDocument>);
}
