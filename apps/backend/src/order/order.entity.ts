import { Column, ManyToOne, JoinColumn, Entity, OneToOne } from 'typeorm';

import { User } from '../user/user.entity';
import { Credit } from '../credit/credit.entity';
import { BaseEditableEntity } from '../common/model/base-editable.entity';

import { CreditLimit } from '../credit/interface/credit-limit.interface';
import { CreditDuration } from '../credit/interface/credit-duration.interface';
import { OrderStatus } from './interface/order-status.interface';

@Entity()
export class Order extends BaseEditableEntity {
  @Column({ name: 'price', type: 'int' })
  public price: number;

  @Column({
    name: 'status',
    type: 'enum',
    enum: OrderStatus,
    default: OrderStatus.Created,
  })
  public status: OrderStatus;

  @Column({
    name: 'credit_limit_type',
    type: 'enum',
    enum: CreditLimit,
  })
  public creditLimit: CreditLimit;

  @Column({
    name: 'credit_duration_type',
    type: 'enum',
    enum: CreditDuration,
  })
  public creditDuration: CreditDuration;

  @ManyToOne(() => User, { eager: true })
  @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
  public user: User;

  @OneToOne(() => Credit, { eager: true, nullable: true })
  @JoinColumn({ name: 'credit_id', referencedColumnName: 'id' })
  public credit?: Credit;

  public belongsTo(userId: string): boolean {
    return this.user.id === userId;
  }
}
