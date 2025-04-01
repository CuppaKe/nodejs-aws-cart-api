import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Cart as CartEntity, CartItem, CartStatus } from '../entities/index';
import { PutCartPayload } from 'src/order/type';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(CartEntity)
    private readonly cartRepository: Repository<CartEntity>,

    @InjectRepository(CartItem)
    private readonly cartItemRepository: Repository<CartItem>,
  ) {}

  async findByUserId(userId: string): Promise<CartEntity> {
    return await this.cartRepository.findOne({
      where: { user_id: userId },
      relations: ['items'],
    });
  }

  async createByUserId(user_id: string): Promise<CartEntity> {
    const newCart = await this.cartRepository.create({
      user_id,
      status: CartStatus.OPEN,
    });

    return await this.cartRepository.save(newCart);
  }

  async findOrCreateByUserId(userId: string): Promise<CartEntity> {
    const userCart = await this.findByUserId(userId);

    if (userCart) {
      return userCart;
    }

    return await this.createByUserId(userId);
  }

  async updateByUserId(
    userId: string,
    payload: PutCartPayload,
  ): Promise<CartEntity> {
    const userCart = await this.findOrCreateByUserId(userId);

    const itemToModify = userCart.items.find(
      ({ product_id }) => product_id === payload.product.id,
    );

    if (!itemToModify) {
      const newItem = await this.cartItemRepository.create({
        cart: userCart,
        product_id: payload.product.id,
        count: payload.count,
      });

      this.cartItemRepository.save(newItem);
    } else {
      payload.count <= 0
        ? await this.cartItemRepository.delete({
            cart: userCart,
            product: payload.product,
          })
        : await this.cartItemRepository.save({
            ...itemToModify,
            count: payload.count,
          });
    }

    return await this.findOrCreateByUserId(userId);
  }

  async removeByUserId(userId): Promise<void> {
    const result = await this.cartRepository.delete({ user_id: userId });

    if (result.affected === 0) {
      throw new Error(`Cart for user with ID ${userId} not found.`);
    }
  }

  async getAll(): Promise<CartEntity[]> {
    return await this.cartRepository.find();
  }
}
