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
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => User, (user) => user.mealTime)
  @JoinColumn()
  user: User;

  @Column({ type: 'time', nullable: true })
  breakfast: string;

  @Column({ type: 'time', nullable: true })
  lunch: string;

  @Column({ type: 'time', nullable: true })
  snacks: string;

  @Column({ type: 'time', nullable: true })
  dinner: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
