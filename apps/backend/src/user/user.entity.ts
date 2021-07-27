import { Column, Entity } from 'typeorm';
import { BaseEditableEntity } from '../common/model/base-editable.entity';

@Entity()
export class User extends BaseEditableEntity {
  @Column({
    name: 'auth_id',
    type: 'varchar',
    length: 40,
    nullable: false,
    unique: true,
  })
  public authId: string;

  @Column({
    name: 'email',
    type: 'varchar',
    length: 255,
    nullable: false,
    unique: true,
  })
  public email: string;

  @Column({ name: 'first_name', type: 'varchar', length: 80, nullable: true })
  public firstName: string;

  @Column({ name: 'last_name', type: 'varchar', length: 80, nullable: true })
  public lastName: string;
}
