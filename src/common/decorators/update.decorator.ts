import {
    registerDecorator,
    ValidationOptions,
    ValidatorConstraint,
    ValidatorConstraintInterface,
    ValidationArguments,
} from "class-validator";

@ValidatorConstraint({ name: 'Check_Fields_Exist', async: false })
export class CheckIfAnyFieldsAreApplied implements ValidatorConstraintInterface {
    validate(value: any, args: ValidationArguments) {
        
        
        // console.log(({
        //     value, args,
            
        //     matchWith: args.constraints[0],
        //     matchWithValue: args.object[args.constraints[0]]
        // }));

        return Object.keys(args.object).length > 0 && Object.values(args.object).filter(arg => {
            return arg != undefined
        }).length > 0;
    }
    defaultMessage(validationArguments?: ValidationArguments): string {
        return `All update fields are empty`
    } // run when return is false
}

export function ContainField(
    validationOptions?: ValidationOptions) {
    return function (constructor:Function) {
        registerDecorator({
            target: constructor,
            propertyName: undefined !,
            options: validationOptions,
            constraints:[],
            validator: CheckIfAnyFieldsAreApplied,
        });
    };
}