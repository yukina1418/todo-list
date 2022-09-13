import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { Between, DataSource } from 'typeorm';
import dayjs from 'dayjs';
import localeData from 'dayjs/plugin/localeData';

import { CreateTaskDTO, GetDateParams, UpdateTaskDTO, UpdateTaskParams } from './dto';
import { Task } from './task.entity';
import { User } from '../user';

dayjs.extend(localeData);

@Injectable()
export class TaskService {
  constructor(private readonly dataSource: DataSource) {}

  /**
   * @Description 투두를 생성합니다.
   *
   * @param user 유저 ID
   * @param createTask 생성하는 Task 정보
   * @returns Promise<Task>
   */
  async create(user: User, createTask: CreateTaskDTO): Promise<Task> {
    const { date, ...data } = createTask;
    const createdAt = dayjs(date).toDate();

    const isUser = await this.dataSource.manager.findOne(User, {
      where: { id: user.id },
    });

    if (!isUser) throw new NotFoundException('유저가 존재하지 않습니다.');

    return await this.dataSource.manager.save(Task, {
      fk_user_id: user.id,
      createdAt,
      ...data,
    });
  }

  /**
   * @Description 요청한 ID의 투두를 반환합니다.
   *
   * @param user 유저 ID
   * @param id 조회할 Task ID
   * @returns Promise<Task>
   */
  async getTask(user: User, id: number): Promise<Task> {
    const isTask = await this.dataSource.manager.findOne(Task, {
      where: { id },
    });

    if (!isTask) throw new NotFoundException('해당하는 태스크가 존재하지 않습니다.');

    if (isTask.fk_user_id !== user.id) throw new ForbiddenException('해당하는 태스크를 조회할 권한이 없습니다.');

    return isTask;
  }

  /**
   * @Description 요청한 날의 투두리스트를 반환합니다.
   *
   * @param user 유저 ID
   * @param params 조회를 요청한 날짜
   * @returns Promise<Task[]>
   */
  async getTasksByDay(user: User, params: GetDateParams): Promise<Task[]> {
    const { date } = params;

    const start = dayjs(date).startOf('day').toDate();
    const end = dayjs(date).endOf('day').toDate();

    const tasks = await this.dataSource.manager.find(Task, {
      where: { fk_user_id: user.id, createdAt: Between(start, end) },
    });
    return tasks;
  }

  /**
   * @Description 요청한 주간의 투두리스트를 반환합니다.
   *
   * @param user 유저 ID
   * @param params 조회를 요청한 날짜
   * @returns Promise<Task[]>
   */
  async getTasksByWeek(user: User, params: GetDateParams): Promise<Task[]> {
    const { date } = params;

    const start = dayjs(date).startOf('week').toDate();
    const end = dayjs(date).endOf('week').toDate();

    const tasks = await this.dataSource.manager.find(Task, {
      where: { fk_user_id: user.id, createdAt: Between(start, end) },
    });
    return tasks;
  }

  /**
   * @Description 요청한 월간의 투두리스트를 반환합니다.
   *
   * @param user 유저 ID
   * @param params 조회를 요청한 날짜
   * @returns Promise<Task[]>
   */
  async getTasksByMonth(user: User, params: GetDateParams) {
    const { date } = params;

    const start = dayjs(date).startOf('month').toDate();
    const end = dayjs(date).endOf('month').toDate();

    const tasks = await this.dataSource.manager.find(Task, {
      where: { fk_user_id: user.id, createdAt: Between(start, end) },
    });
    return tasks;
  }

  /**
   * @Description 요청한 ID의 투두를 수정합니다.
   *
   * @param user 유저 ID
   * @param id Task ID
   * @param updateTask 업데이트할 Task 정보
   * @returns Promise<Task>
   */
  async updateTask(user: User, id: number, updateTask: UpdateTaskDTO): Promise<Task> {
    const isTask = await this.dataSource.manager.findOne(Task, {
      where: { id },
    });

    if (!isTask) throw new NotFoundException('해당하는 태스크가 존재하지 않습니다.');

    if (isTask.fk_user_id !== user.id) throw new ForbiddenException('해당하는 태스크를 수정할 권한이 없습니다.');

    return await this.dataSource.manager.save(Task, {
      ...isTask,
      ...updateTask,
    });
  }

  async updateTaskStatus(user: User, params: UpdateTaskParams): Promise<Task> {
    const { id, status } = params;

    const isTask = await this.dataSource.manager.findOne(Task, {
      where: { id },
    });

    if (!isTask) throw new NotFoundException('해당하는 태스크가 존재하지 않습니다.');

    if (isTask.fk_user_id !== user.id) throw new ForbiddenException('해당하는 태스크를 수정할 권한이 없습니다.');

    return await this.dataSource.manager.save(Task, {
      ...isTask,
      status,
    });
  }

  /**
   * @Description 요청한 ID의 투두를 삭제합니다.
   *
   * @param user 유저 ID
   * @param id 삭제할 Task ID
   * @returns Promise<string>
   */
  async deleteTask(user: User, id: number): Promise<string> {
    const isTask = await this.dataSource.manager.findOne(Task, {
      where: { id },
    });

    if (!isTask) throw new NotFoundException('해당하는 태스크가 존재하지 않습니다.');

    if (isTask.fk_user_id !== user.id) throw new ForbiddenException('해당하는 태스크를 삭제할 권한이 없습니다.');

    const result = await this.dataSource.manager.delete(Task, { id });

    return result.affected === 1 ? '삭제되었습니다.' : '삭제에 실패했습니다.';
  }
}
