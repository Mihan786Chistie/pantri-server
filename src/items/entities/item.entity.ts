import { User } from 'src/users/entities/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Item {
  @PrimaryGeneratedColumn()
  id: number;

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

  constructor(item?: Partial<Item>) {
    Object.assign(this, item);
  }
}
