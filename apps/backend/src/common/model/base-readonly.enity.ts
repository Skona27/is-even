import { CreateDateColumn, PrimaryGeneratedColumn } from 'typeorm';

export abstract class BaseReadonlyEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn()
  createdAt: Date;
}
