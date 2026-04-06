import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity()
export class MealTime {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => User, (user) => user.mealTime)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column()
  userId: string;

  @Column({ type: 'time', nullable: true })
  breakfast: string;

  @Column({ type: 'time', nullable: true })
  lunch: string;

  @Column({ type: 'time', nullable: true })
  snacks: string;

  @Column({ type: 'time', nullable: true })
  dinner: string;

  @Column({ type: 'int', default: 0 })
  timezoneOffset?: number;

  @Column({ nullable: true })
  timezone?: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
