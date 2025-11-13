import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

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

  constructor(item?: Partial<Item>) {
    Object.assign(this, item);
  }
}
