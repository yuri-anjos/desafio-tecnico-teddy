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
import { ApiProperty } from '@nestjs/swagger';

@Entity('compact_url')
export class CompactUrl {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @Column({ type: 'varchar', length: 6, unique: true })
  urlCode: string;

  @ApiProperty()
  @Column({ type: 'text' })
  originalUrl: string;

  @ApiProperty()
  @Column({ type: 'int', default: 0 })
  clickCount: number;

  @ManyToOne(() => User, (user) => user.compactUrls, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  user?: User;

  @ApiProperty()
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty()
  @UpdateDateColumn()
  updatedAt: Date;

  @ApiProperty()
  @DeleteDateColumn({ nullable: true })
  deletedAt: Date | null;
}
