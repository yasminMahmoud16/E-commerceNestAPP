import {
    registerDecorator,
    ValidationOptions,
    ValidatorConstraint,
    ValidatorConstraintInterface,
    ValidationArguments,
} from "class-validator";
import { Types } from "mongoose";

@ValidatorConstraint({ name: 'match_between_fields', async: false })
export class MongoDbId
    implements ValidatorConstraintInterface {
    validate(ids: Types.ObjectId[], args: ValidationArguments): boolean {
        for (const id of ids) {
            if (!Types.ObjectId.isValid(id)) {
                return false;
            }
        }
        return true;
    }
    defaultMessage(validationArguments?: ValidationArguments): string {
        return `Invalid mongoDbId  formate`
    } // run when return is false
}
@ValidatorConstraint({ name: 'match_between_fields', async: false })
export class MatchBetweenFields<T = any> implements ValidatorConstraintInterface {
    validate(value: T, args: ValidationArguments) {
        console.log(({
            value, args,
            
            matchWith: args.constraints[0],
            matchWithValue: args.object[args.constraints[0]]
        }));

        return value === args.object[args.constraints[0]]
    }
    defaultMessage(validationArguments?: ValidationArguments): string {
        return `failed to match src field :: ${validationArguments?.property} with target ${validationArguments?.constraints[0]}`
    } // run when return is false
}

export function IsMatch<T = any>(constraints: string[], validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        registerDecorator({
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            constraints,
            validator: MatchBetweenFields<T>,
        });
    };
}