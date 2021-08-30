import { Column, Entity, ManyToOne, JoinColumn, OneToOne } from 'typeorm';

import { Order } from '../order/order.entity';
import { User } from '../user/user.entity';
import { BaseReadonlyEntity } from '../common/model/base-readonly.enity';

@Entity()
export class Payment extends BaseReadonlyEntity {
  @Column({
    name: 'payment_provider_id',
    type: 'varchar',
    length: 40,
    unique: true,
  })
  public paymentProviderId: string;

  @ManyToOne(() => User, { eager: true })
  @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
  public user: User;

  @OneToOne(() => Order, { eager: true })
  @JoinColumn({ name: 'order_id', referencedColumnName: 'id' })
  public order: Order;
}
