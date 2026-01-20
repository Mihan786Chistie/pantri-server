import { User } from "src/users/entities/user.entity";
import { Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Notification } from "../constants";

@Entity()
export class Ai {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => User, (user) => user.aiNotifications, { onDelete: 'CASCADE' })
    @Index()
    @JoinColumn({ name: 'userId' })
    user: User;

    @Column({ type: 'jsonb', nullable: true })
    notifications: Notification[];

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}