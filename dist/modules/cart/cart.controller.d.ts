import { CartService } from './cart.service';
import { CreateCartDto } from './dto/create-cart.dto';
import { RemoveItemsFromCartDto } from './dto/update-cart.dto';
import { IResponse } from 'src/common';
import { type UserDocument } from 'src/DB';
import { CartResponse } from './entities/cart.entity';
import { type Response } from 'express';
export declare class CartController {
    private readonly cartService;
    constructor(cartService: CartService);
    create(user: UserDocument, createCartDto: CreateCartDto, res: Response): Promise<IResponse<CartResponse>>;
    removeItemsFromCart(user: UserDocument, removeItemsFromCartDto: RemoveItemsFromCartDto): Promise<IResponse<CartResponse>>;
    clearCart(user: UserDocument): Promise<IResponse>;
    findOneCart(user: UserDocument): Promise<IResponse<CartResponse>>;
}
