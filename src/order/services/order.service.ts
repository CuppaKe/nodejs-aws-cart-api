import { Injectable } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Order } from '../models';
import { CreateOrderPayload } from '../type';
import { Order as OrderEntity, OrderStatus } from '../entities/index';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(OrderEntity)
    private readonly orderRepository: Repository<OrderEntity>,
  ) {}

  async getAll(): Promise<OrderEntity[]> {
    return await this.orderRepository.find();
  }

  async findById(orderId: string): Promise<OrderEntity> {
    return await this.orderRepository.findOne({
      where: { id: orderId },
    });
  }

  async create(data: CreateOrderPayload) {
    const order = await this.orderRepository.create({
      ...data,
      cart: { id: data.cartId },
      payment: {},
      delivery: data.address,
      comments: '',
      status: OrderStatus.PENDING,
      total: data.total,
    });

    return await this.orderRepository.save(order);
  }

  // TODO add  type
  async update(orderId: string, data: Order) {
    const order = await this.findById(orderId);

    if (!order) {
      throw new Error('Order does not exist.');
    }

    this.orderRepository.save({ ...order, ...data });
  }
}
