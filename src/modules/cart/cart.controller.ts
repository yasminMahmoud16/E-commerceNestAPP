import { Controller, Get, Post, Body, Patch, Param, Delete, UsePipes, ValidationPipe, Res } from '@nestjs/common';
import { CartService } from './cart.service';
import { CreateCartDto } from './dto/create-cart.dto';
import { RemoveItemsFromCartDto, UpdateCartDto } from './dto/update-cart.dto';
import { Auth, IResponse, RoleEnum, successResponse, User } from 'src/common';
import { type  UserDocument } from 'src/DB';
import { CartResponse } from './entities/cart.entity';
import {type Response } from 'express';
@Auth([RoleEnum.user])
@UsePipes(new ValidationPipe({whitelist:true , forbidNonWhitelisted:true}))
@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post()
  async create(
    @User() user:UserDocument,
    @Body() createCartDto: CreateCartDto,
    @Res({passthrough:true}) res:Response
  ):Promise<IResponse<CartResponse>> {
    const { status, cart } = await this.cartService.create(createCartDto, user);
    res.status(status)
    return successResponse<CartResponse>({ status, data: { cart } });
    // return "donr";
  }
  @Patch("remove-items-from-cart")
  async removeItemsFromCart(
    @User() user:UserDocument,
    @Body() removeItemsFromCartDto: RemoveItemsFromCartDto,
  ): Promise<IResponse<CartResponse>> {
    const  cart  = await this.cartService.removeItemsFromCart(removeItemsFromCartDto, user);
    return successResponse<CartResponse>({  data: { cart } });
    // return "donr";
  }
  @Delete("clear-cart")
  async clearCart(
    @User() user:UserDocument,
  ): Promise<IResponse> {
    const cart = await this.cartService.clearCart( user);
    return successResponse();
    // return "donr";
  }
  @Get()
  async findOneCart(
    @User() user:UserDocument,
  ): Promise<IResponse<CartResponse>> {
    const cart = await this.cartService.findOneCart( user);
    return successResponse<CartResponse>({data:{cart}});
    // return "donr";
  }


}
