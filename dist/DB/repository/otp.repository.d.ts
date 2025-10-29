import { DatabaseRepository } from "./database.repository";
import { OtpDocument as TDocument, Otp } from "../models";
import { Model } from "mongoose";
export declare class OtpRepository extends DatabaseRepository<Otp> {
    protected readonly model: Model<TDocument>;
    constructor(model: Model<TDocument>);
}
