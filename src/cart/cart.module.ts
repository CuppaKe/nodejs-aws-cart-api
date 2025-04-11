import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { OrderModule } from '../order/order.module';
import { CartController } from './cart.controller';
import { CartService } from './services';
import { Cart, CartItem, Product } from './entities/index';

@Module({
  imports: [TypeOrmModule.forFeature([Cart, CartItem, Product]), OrderModule],
  providers: [CartService],
  controllers: [CartController],
})
export class CartModule {}
