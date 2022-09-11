import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
@Index(['email'], { unique: true })
export class User {
  @ApiProperty({ description: '유저 고유 넘버링' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ description: '유저 이메일' })
  @Column()
  email: string;

  @Column()
  password: string;

  @ApiProperty({ description: '유저 거주 국가' })
  @Column({ default: 'Asia/Seoul' })
  country: string;

  @ApiProperty({ description: '유저 이름' })
  @Column()
  name: string;

  @ApiProperty({ description: '유저 계정 생성일' })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({ description: '유저 계정 수정일' })
  @UpdateDateColumn()
  updatedAt: Date;

  @ApiProperty({ description: '유저 계정 삭제일' })
  @DeleteDateColumn()
  deletedAt: Date;
}
