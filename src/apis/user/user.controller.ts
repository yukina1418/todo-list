import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Delete,
  UseGuards,
  HttpException,
  InternalServerErrorException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UserService } from './user.service';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { User } from './user.entity';
import { CurrentUser, ICurrentUser } from 'src/commons/decorator/current-user';
import { ResponseType } from 'src/commons/type/response-type';
import { ErrorType } from 'src/commons/type/error-type';
import { CreateUserDTO, UpdateUserDTO } from './dto';

@ApiTags('유저')
@Controller({ path: 'users', version: '1.0' })
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @ApiOperation({ summary: '유저 생성', description: '유저를 생성합니다.' })
  // 스웨거 데코레이터
  @ApiBody({ type: CreateUserDTO })
  @ApiCreatedResponse({ description: ResponseType.user.create.msg })
  @ApiConflictResponse({ description: ErrorType.user.conflict.msg })
  async create(@Body() createUser: CreateUserDTO): Promise<User> {
    return this.userService.signUp(createUser).catch((err: unknown) => {
      if (err instanceof HttpException) {
        throw err;
      }
      throw new InternalServerErrorException('유저 정보 생성 서버 오류');
    });
  }

  @Get('list')
  // 스웨거 데코레이터
  @ApiOperation({
    summary: '유저 전체 조회',
    description: '유저 전체 조회',
  })
  @ApiOkResponse({
    status: 200,
    description: '전체 유저를 성공적으로 조회했습니다.',
    type: [User],
  })
  async findAll(): Promise<User[]> {
    return this.userService.findAll().catch((err: unknown) => {
      if (err instanceof HttpException) {
        throw err;
      }
      throw new InternalServerErrorException('유저 목록 조회 서버 오류');
    });
  }

  @Get()
  @UseGuards(AuthGuard('access'))
  @ApiOperation({ summary: '유저 조회', description: '유저를 조회합니다.' })
  // 스웨거 데코레이터
  @ApiBearerAuth('access_token')
  @ApiOkResponse({ description: ResponseType.user.fetch.msg })
  @ApiForbiddenResponse({ description: ErrorType.user.forbidden.msg })
  @ApiNotFoundResponse({ description: ErrorType.user.notFound.msg })
  async fetch(@CurrentUser() currentUser: ICurrentUser): Promise<User> {
    return this.userService.findOne(currentUser).catch((err: unknown) => {
      if (err instanceof HttpException) {
        throw err;
      }
      throw new InternalServerErrorException('유저 정보 조회 서버 오류');
    });
  }

  @Patch()
  @UseGuards(AuthGuard('access'))
  @ApiOperation({ summary: '유저 수정', description: '정보를 수정합니다.' })
  // 스웨거 데코레이터
  @ApiBearerAuth('access_token')
  @ApiBody({ type: UpdateUserDTO })
  @ApiOkResponse({ description: ResponseType.user.update.msg })
  @ApiForbiddenResponse({ description: ErrorType.user.forbidden.msg })
  @ApiNotFoundResponse({ description: ErrorType.user.notFound.msg })
  async update(
    @CurrentUser() currentUser: ICurrentUser,
    @Body() updateUser: UpdateUserDTO,
  ): Promise<User> {
    return this.userService
      .update(currentUser, updateUser)
      .catch((err: unknown) => {
        if (err instanceof HttpException) {
          throw err;
        }
        throw new InternalServerErrorException('유저 정보 수정 서버 오류');
      });
  }

  @Delete()
  @UseGuards(AuthGuard('access'))
  @ApiOperation({ summary: '유저 삭제', description: '유저를 삭제합니다.' })
  // 스웨거 데코레이터
  @ApiBearerAuth('access_token')
  @ApiOkResponse({ description: ResponseType.user.delete.msg })
  @ApiForbiddenResponse({ description: ErrorType.user.forbidden.msg })
  @ApiNotFoundResponse({ description: ErrorType.user.notFound.msg })
  async delete(@CurrentUser() currentUser: ICurrentUser): Promise<string> {
    return this.userService.delete(currentUser).catch((err: unknown) => {
      if (err instanceof HttpException) {
        throw err;
      }
      throw new InternalServerErrorException('유저 정보 삭제 서버 오류');
    });
  }
}
