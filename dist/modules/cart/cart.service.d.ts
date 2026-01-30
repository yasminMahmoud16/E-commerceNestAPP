import { CreateCartDto } from './dto/create-cart.dto';
import { RemoveItemsFromCartDto } from './dto/update-cart.dto';
import { CartDocument, CartRepository, ProductRepository, UserDocument } from 'src/DB';
export declare class CartService {
    private readonly productRepository;
    private readonly cartRepository;
    constructor(productRepository: ProductRepository, cartRepository: CartRepository);
    create(createCartDto: CreateCartDto, user: UserDocument): Promise<{
        status: number;
        cart: CartDocument;
    }>;
    removeItemsFromCart(removeItemsFromCartDto: RemoveItemsFromCartDto, user: UserDocument): Promise<CartDocument>;
    clearCart(user: UserDocument): Promise<String>;
    findOneCart(user: UserDocument): Promise<CartDocument>;
}
