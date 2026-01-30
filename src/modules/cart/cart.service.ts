import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateCartDto } from './dto/create-cart.dto';
import { RemoveItemsFromCartDto, UpdateCartDto } from './dto/update-cart.dto';
import { CartDocument, CartRepository, ProductRepository, UserDocument } from 'src/DB';
import { equal } from 'assert';
import { Types } from 'mongoose';

@Injectable()
export class CartService {
  constructor(
    private readonly productRepository: ProductRepository,
    private readonly cartRepository: CartRepository,
  ) { }
  async create(
    createCartDto: CreateCartDto, user: UserDocument
  )
    : Promise<{ status: number; cart: CartDocument }>
  {
    console.log({user});
    console.log(createCartDto.productId);
    
    // check product exists
    const product = await this.productRepository.findOne({
      filter: {
        _id: createCartDto.productId ,
        stock: {
          $gte: createCartDto.quantity
        }
      }
    });
   
    
    if (!product) {
      throw new NotFoundException("Product is out of stock");
    }

    // if exists (add the product for the first time in cart | update quantity | add in cart already exists)
    const cart = await this.cartRepository.findOne({ filter: { createdBy: user._id } });
    if (!cart) {
      // create new cart
      const [newCart] = await this.cartRepository.create({
        data: [{
          createdBy: user._id,
          products: [{
            createdBy: user._id,
            productId: product._id,
            quantity: createCartDto.quantity
          }]
        }]

      })
      if (!newCart) {
        throw new BadRequestException("Failed to create user cart");
      }

      return { status: 201, cart: newCart }
    }
    
    const checkProductInCart = cart.products.find(product => {

      
      
      return product.productId == createCartDto.productId;
    })
    if (checkProductInCart) {
      checkProductInCart.quantity = createCartDto.quantity
    } else {
      cart.products.push({
        productId: product._id,
        quantity: createCartDto.quantity
      })
    }
    
    await cart.save()
    return {
      status: 200,
      cart 
    };
  }
  async removeItemsFromCart(
    removeItemsFromCartDto: RemoveItemsFromCartDto, user: UserDocument
  )
    : Promise<CartDocument>
  {

    // if exists (add the product for the first time in cart | update quantity | add in cart already exists)
    const cart = await this.cartRepository.findOneAndUpdate({
      filter: { createdBy: user._id },
      update: {
        $pull:{products:{_id:{$in:removeItemsFromCartDto.productIds}}}
      }
    });
    if (!cart) {
      throw new NotFoundException("Faild to find matchnig result ")
      
    }
    
    
    return cart
  }
  async clearCart(
    user: UserDocument
  )
    : Promise<String>
  {

    // if exists (add the product for the first time in cart | update quantity | add in cart already exists)
    const cart = await this.cartRepository.deleteOne({
      filter: { createdBy: user._id },
    });
    if (!cart.deletedCount) {
      throw new NotFoundException("Faild to find matchnig result ")
      
    }
    
    
    return "Done"
  }

  async findOneCart(
    user: UserDocument
  )
    : Promise<CartDocument> {

    // if exists (add the product for the first time in cart | update quantity | add in cart already exists)
    const cart = await this.cartRepository.findOne({
      filter: { createdBy: user._id },
      options: {
        populate: [
          {
            path:"products.productId"
          }
        ]
      }
    });
    if (!cart) {
      throw new NotFoundException("Faild to find matchnig result ")
    }


    return cart
  }

}
