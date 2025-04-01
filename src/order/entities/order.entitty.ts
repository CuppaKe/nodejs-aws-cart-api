import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { Cart } from '../../cart/entities/cart.entity';

export enum OrderStatus {
  PENDING = 'PENDING',
  PAID = 'PAID',
  SHIPPED = 'SHIPPED',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED',
}

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', nullable: false })
  userId: string;

  @OneToOne(() => Cart, { cascade: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'cart_id' })
  cart: Cart;

  @Column({ type: 'jsonb', nullable: false })
  payment: Record<string, any>;

  @Column({ type: 'jsonb', nullable: false })
  delivery: Record<string, any>;

  @Column({ type: 'text', nullable: true })
  comments?: string;

  @Column({ type: 'enum', enum: OrderStatus, nullable: false })
  status: OrderStatus;

  @Column({ type: 'numeric', precision: 10, scale: 2, nullable: false })
  total: number;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
