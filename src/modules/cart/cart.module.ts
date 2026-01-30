import { Module } from '@nestjs/common';
import { CartService } from './cart.service';
import { CartController } from './cart.controller';
import { Cart, CartRepository , cartSchema, Product, ProductRepository, productSchema } from 'src/DB';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
      MongooseModule.forFeature([
        { name: Product.name, schema: productSchema },
        { name: Cart.name, schema: cartSchema },
      ]),
    ],
  controllers: [CartController],
  providers: [CartService, CartRepository, ProductRepository],
})
export class CartModule {}
