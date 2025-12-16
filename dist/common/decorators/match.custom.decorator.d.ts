import { ValidationOptions, ValidatorConstraintInterface, ValidationArguments } from "class-validator";
import { Types } from "mongoose";
export declare class MongoDbId implements ValidatorConstraintInterface {
    validate(ids: Types.ObjectId[], args: ValidationArguments): boolean;
    defaultMessage(validationArguments?: ValidationArguments): string;
}
export declare class MatchBetweenFields<T = any> implements ValidatorConstraintInterface {
    validate(value: T, args: ValidationArguments): boolean;
    defaultMessage(validationArguments?: ValidationArguments): string;
}
export declare function IsMatch<T = any>(constraints: string[], validationOptions?: ValidationOptions): (object: Object, propertyName: string) => void;
