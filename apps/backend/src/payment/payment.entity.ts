import { Column, Entity, ManyToOne, JoinColumn } from 'typeorm';

import { Order } from '../order/order.entity';
import { User } from '../user/user.entity';
import { BaseReadonlyEntity } from '../common/model/base-readonly.enity';
import { PaymentStatus } from './interface/payment-status.interface';

@Entity()
export class Payment extends BaseReadonlyEntity {
  @Column({
    name: 'session_id',
    type: 'varchar',
    length: 128,
    unique: true,
  })
  public sessionId: string;

  @Column({
    name: 'status',
    type: 'enum',
    enum: PaymentStatus,
    default: PaymentStatus.Pending,
  })
  public status: PaymentStatus;

  @ManyToOne(() => User, { eager: true })
  @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
  public user: User;

  @ManyToOne(() => Order, { eager: true })
  @JoinColumn({ name: 'order_id', referencedColumnName: 'id' })
  public order: Order;
}
