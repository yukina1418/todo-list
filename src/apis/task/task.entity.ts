import { ApiProperty } from '@nestjs/swagger';
import { User } from 'src/apis/user/user.entity';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Task extends BaseEntity {
  @ApiProperty({ description: '할일 고유 넘버링' })
  @PrimaryGeneratedColumn('increment')
  id: number;

  @ApiProperty({ description: '할일 제목' })
  @Column()
  title: string;

  @ApiProperty({ description: '할일 설명' })
  @Column()
  content: string;

  @Column({ default: false })
  state: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column()
  fk_user_id: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'fk_user_id' })
  user: User;
}
