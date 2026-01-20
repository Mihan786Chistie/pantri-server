import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import * as bcrypt from 'bcrypt';
import { Item } from 'src/items/entities/item.entity';
import { MealTime } from './mealtime.entity';
import { Ai } from 'src/ai/entities/ai.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ nullable: true })
  hashedRefreshToken: string;

  @Column({ nullable: true })
  avatarUrl?: string;

  @CreateDateColumn()
  createdAt: Date;

  @OneToMany(() => Item, (item) => item.user)
  items: Item[];

  @OneToOne(() => MealTime, (mealTime) => mealTime.user)
  mealTime: MealTime;

  @OneToMany(() => Ai, (ai) => ai.user)
  aiNotifications: Ai[];

  @BeforeInsert()
  async hashedPassword() {
    this.password = await bcrypt.hash(this.password, 10);
  }
}
