import { Column, ManyToOne, JoinColumn, Entity } from 'typeorm';

import { User } from '../user/user.entity';
import { BaseEditableEntity } from '../common/model/base-editable.entity';

@Entity()
export class Credit extends BaseEditableEntity {
  @Column({ name: 'limit', type: 'int' })
  public limit: number;

  @Column({ name: 'usage', type: 'int' })
  public usage: number;

  @Column({ name: 'from_date', type: 'timestamp' })
  public fromDate: Date;

  @Column({ name: 'to_date', type: 'timestamp' })
  public toDate: Date;

  @ManyToOne(() => User, { eager: true })
  @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
  public user: User;

  public belongsTo(userId: string): boolean {
    return this.user.id === userId;
  }

  public isExceeded(): boolean {
    return this.usage >= this.limit;
  }

  // TODO - valdiate dates with present date
  public isActive(): boolean {
    return true;
  }

  public incrementUsage(): void {
    this.usage++;
  }
}
