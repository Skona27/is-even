import { Column, Entity, ManyToOne, JoinColumn } from 'typeorm';

import { User } from '../user/user.entity';
import { BaseReadonlyEntity } from '../common/model/base-readonly.enity';

@Entity()
export class ApiKey extends BaseReadonlyEntity {
  @Column({ name: 'name', type: 'varchar', length: 255 })
  public name: string;

  @Column({ name: 'value', type: 'varchar', length: 50, unique: true })
  public value: string;

  @Column({ name: 'last_used', type: 'timestamp', nullable: true })
  public lastUsed?: Date;

  @ManyToOne(() => User, { eager: true })
  @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
  public user: User;

  public belongsTo(userId: string): boolean {
    return this.user.id === userId;
  }
}
