import { CreateCartDto } from './create-cart.dto';
import { Types } from 'mongoose';
export declare class RemoveItemsFromCartDto {
    productIds: Types.ObjectId[];
}
declare const UpdateCartDto_base: import("@nestjs/mapped-types").MappedType<Partial<CreateCartDto>>;
export declare class UpdateCartDto extends UpdateCartDto_base {
}
export {};
