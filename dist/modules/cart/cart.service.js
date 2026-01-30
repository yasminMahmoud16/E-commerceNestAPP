"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CartService = void 0;
const common_1 = require("@nestjs/common");
const DB_1 = require("../../DB");
let CartService = class CartService {
    productRepository;
    cartRepository;
    constructor(productRepository, cartRepository) {
        this.productRepository = productRepository;
        this.cartRepository = cartRepository;
    }
    async create(createCartDto, user) {
        console.log({ user });
        console.log(createCartDto.productId);
        const product = await this.productRepository.findOne({
            filter: {
                _id: createCartDto.productId,
                stock: {
                    $gte: createCartDto.quantity
                }
            }
        });
        if (!product) {
            throw new common_1.NotFoundException("Product is out of stock");
        }
        const cart = await this.cartRepository.findOne({ filter: { createdBy: user._id } });
        if (!cart) {
            const [newCart] = await this.cartRepository.create({
                data: [{
                        createdBy: user._id,
                        products: [{
                                createdBy: user._id,
                                productId: product._id,
                                quantity: createCartDto.quantity
                            }]
                    }]
            });
            if (!newCart) {
                throw new common_1.BadRequestException("Failed to create user cart");
            }
            return { status: 201, cart: newCart };
        }
        const checkProductInCart = cart.products.find(product => {
            return product.productId == createCartDto.productId;
        });
        if (checkProductInCart) {
            checkProductInCart.quantity = createCartDto.quantity;
        }
        else {
            cart.products.push({
                productId: product._id,
                quantity: createCartDto.quantity
            });
        }
        await cart.save();
        return {
            status: 200,
            cart
        };
    }
    async removeItemsFromCart(removeItemsFromCartDto, user) {
        const cart = await this.cartRepository.findOneAndUpdate({
            filter: { createdBy: user._id },
            update: {
                $pull: { products: { _id: { $in: removeItemsFromCartDto.productIds } } }
            }
        });
        if (!cart) {
            throw new common_1.NotFoundException("Faild to find matchnig result ");
        }
        return cart;
    }
    async clearCart(user) {
        const cart = await this.cartRepository.deleteOne({
            filter: { createdBy: user._id },
        });
        if (!cart.deletedCount) {
            throw new common_1.NotFoundException("Faild to find matchnig result ");
        }
        return "Done";
    }
    async findOneCart(user) {
        const cart = await this.cartRepository.findOne({
            filter: { createdBy: user._id },
            options: {
                populate: [
                    {
                        path: "products.productId"
                    }
                ]
            }
        });
        if (!cart) {
            throw new common_1.NotFoundException("Faild to find matchnig result ");
        }
        return cart;
    }
};
exports.CartService = CartService;
exports.CartService = CartService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [DB_1.ProductRepository,
        DB_1.CartRepository])
], CartService);
//# sourceMappingURL=cart.service.js.map