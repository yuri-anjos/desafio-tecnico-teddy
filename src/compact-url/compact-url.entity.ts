import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';
import { User } from '../user/user.entity';

@Entity('compact_url')
export class CompactUrl {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 6, unique: true })
  urlCode: string;

  @Column({ type: 'text' })
  originalUrl: string;

  @Column({ type: 'int', default: 0 })
  clickCount: number;

  @ManyToOne(() => User, (user) => user.compactUrls, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  user?: User;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn({ nullable: true })
  deletedAt: Date | null;
}
