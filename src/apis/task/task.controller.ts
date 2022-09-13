import {
  Get,
  Query,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Controller,
  ParseIntPipe,
  HttpException,
  InternalServerErrorException,
} from '@nestjs/common';
import {
  ApiBody,
  ApiTags,
  ApiParam,
  ApiOperation,
  ApiBearerAuth,
  ApiOkResponse,
  ApiNotFoundResponse,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { CurrentUser } from '@app/decorator/decorators';

import { CreateTaskDTO, GetDateParams, UpdateTaskDTO, UpdateTaskParams } from './dto';
import { TaskService } from './task.service';
import { Task } from './task.entity';
import { User } from '../user';

@ApiTags('할일')
@ApiBearerAuth('access_token')
@UseGuards(AuthGuard('access'))
@Controller({ path: 'tasks', version: '1.0' })
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Post()
  @ApiOperation({
    summary: '투두 생성',
    description: '투두 한개를 생성합니다.',
  })
  @ApiBody({ type: CreateTaskDTO })
  async create(@CurrentUser() user: User, @Body() createTask: CreateTaskDTO): Promise<Task> {
    return this.taskService.create(user, createTask).catch((err: unknown) => {
      if (err instanceof HttpException) {
        throw err;
      }
      throw new InternalServerErrorException('투두 조회 서버 오류');
    });
  }

  @Get(':id')
  @ApiOperation({
    summary: '투두 단일 조회',
    description: '투두 단일 조회를 합니다.',
  })
  @ApiParam({ name: 'id', type: 'number', description: '조회할 Task ID' })
  @ApiOkResponse({ description: 'OK', type: Task })
  @ApiNotFoundResponse({ description: '조회한 투두가 존재하지 않을 경우 발생' })
  @ApiForbiddenResponse({ description: '본인이 작성한 투두가 아닌 경우 발생' })
  @ApiInternalServerErrorResponse({ description: '서버에 문제 있을 경우 발생' })
  async findTaskById(@CurrentUser() user: User, @Param('id') id: number): Promise<Task> {
    return await this.taskService.getTask(user, id).catch((err: unknown) => {
      if (err instanceof HttpException) {
        throw err;
      }
      throw new InternalServerErrorException('투두 단일 조회 서버 오류');
    });
  }

  @Get('list/day')
  @ApiOperation({
    summary: '당일 투두리스트 조회',
    description: '당일 투두리스트를 조회합니다.',
  })
  @ApiOkResponse({ description: 'OK', type: [Task] })
  @ApiInternalServerErrorResponse({ description: '서버에 문제 있을 경우 발생' })
  async findTasksByNow(@CurrentUser() user: User, @Query() params: GetDateParams): Promise<Task[]> {
    return this.taskService.getTasksByDay(user, params).catch((err: unknown) => {
      if (err instanceof HttpException) {
        throw err;
      }
      throw new InternalServerErrorException('투두 당일 조회 서버 오류');
    });
  }

  @Get('list/week')
  @ApiOperation({
    summary: '주간 투두리스트 조회',
    description: '주간 투두리스트를 조회합니다.',
  })
  @ApiOkResponse({ description: 'OK', type: [Task] })
  @ApiInternalServerErrorResponse({ description: '서버에 문제 있을 경우 발생' })
  async findTasksByWeak(@CurrentUser() user: User, @Query() params: GetDateParams): Promise<Task[]> {
    return this.taskService.getTasksByWeek(user, params).catch((err: unknown) => {
      if (err instanceof HttpException) {
        throw err;
      }
      console.log(err);
      throw new InternalServerErrorException('투두 주간 조회 서버 오류');
    });
  }

  @Get('list/month')
  @ApiOperation({
    summary: '월간 투두리스트 조회',
    description: '월간 투두리스트를 조회합니다.',
  })
  @ApiOkResponse({ description: 'OK', type: [Task] })
  @ApiInternalServerErrorResponse({ description: '서버에 문제 있을 경우 발생' })
  async findTasksByMonth(@CurrentUser() user: User, @Query() params: GetDateParams): Promise<Task[]> {
    return this.taskService.getTasksByMonth(user, params).catch((err: unknown) => {
      if (err instanceof HttpException) {
        throw err;
      }
      console.log(err);
      throw new InternalServerErrorException('투두 월간 조회 서버 오류');
    });
  }

  @Patch(':id')
  @ApiOperation({
    summary: '투두 정보 수정',
    description: '투두 정보를 수정합니다.',
  })
  @ApiParam({ name: 'id', type: 'number', description: '수정할 Task ID' })
  @ApiBody({ type: UpdateTaskDTO })
  @ApiOkResponse({ description: 'OK', type: Task })
  @ApiNotFoundResponse({ description: '조회한 투두가 존재하지 않을 경우 발생' })
  @ApiForbiddenResponse({ description: '본인이 작성한 투두가 아닌 경우 발생' })
  @ApiInternalServerErrorResponse({ description: '서버에 문제 있을 경우 발생' })
  async updateTaskById(
    @CurrentUser() user: User,
    @Param('id', ParseIntPipe) id: number,
    @Body() updateTask: UpdateTaskDTO,
  ): Promise<Task> {
    return this.taskService.updateTask(user, id, updateTask).catch((err: unknown) => {
      if (err instanceof HttpException) {
        throw err;
      }
      throw new InternalServerErrorException('투두 월간 조회 서버 오류');
    });
  }

  @Patch('status/:id')
  @ApiOperation({ summary: '투두 상태 변경', description: '투두 상태를 변경합니다.' })
  @ApiNotFoundResponse({ description: '조회한 투두가 존재하지 않을 경우 발생' })
  @ApiForbiddenResponse({ description: '본인이 작성한 투두가 아닌 경우 발생' })
  async updateTaskStatusById(@CurrentUser() user: User, @Param() params: UpdateTaskParams): Promise<Task> {
    return this.taskService.updateTaskStatus(user, params).catch((err: unknown) => {
      if (err instanceof HttpException) {
        throw err;
      }
      console.log(err);
      throw new InternalServerErrorException('투두 월간 조회 서버 오류');
    });
  }

  @Delete(':id')
  @ApiOperation({
    summary: '투두 정보 삭제',
    description: '투두 정보를 삭제합니다.',
  })
  @ApiOkResponse({ description: 'OK', schema: { example: '삭제되었습니다.' } })
  @ApiNotFoundResponse({ description: '조회한 투두가 존재하지 않을 경우 발생' })
  @ApiForbiddenResponse({ description: '본인이 작성한 투두가 아닌 경우 발생' })
  @ApiInternalServerErrorResponse({ description: '서버에 문제 있을 경우 발생' })
  async deleteTaskById(@CurrentUser() user: User, @Param('id', ParseIntPipe) id: number): Promise<string> {
    return this.taskService.deleteTask(user, id).catch((err: unknown) => {
      if (err instanceof HttpException) {
        throw err;
      }
      console.log(err);
      throw new InternalServerErrorException('투두 월간 조회 서버 오류');
    });
  }
}
