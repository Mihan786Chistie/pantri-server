import { User } from 'src/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Item {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  category?: string;

  @Column({ type: 'date' })
  expiryDate: Date;

  @Column({ default: false })
  consumed: boolean;

  @ManyToOne(() => User, (user) => user.items)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column()
  userId: string;

  constructor(item?: Partial<Item>) {
    Object.assign(this, item);
  }

  @DeleteDateColumn()
  deletedAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
