import { Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Task } from '../task';

@Entity()
@Index(['fk_task_id', 'id'], { unique: true })
export class Status {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  fk_task_id: string;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => Task)
  @JoinColumn({ name: 'fk_task_id' })
  task: Task;
}
