import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Delete,
  ValidationPipe,
  UseGuards,
  Res,
  Req,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { User } from './entities/user.entity';
import { CurrentUser, ICurrentUser } from 'src/commons/decorator/current-user';
import { ResponseType } from 'src/commons/type/response-type';
import { ErrorType } from 'src/commons/type/error-type';
import { Request } from 'express';

@ApiTags('user')
@Controller({ path: 'user', version: '1.0' })
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @ApiOperation({ summary: '유저 생성', description: '유저를 생성합니다.' })
  // 스웨거 데코레이터
  @ApiBody({ type: CreateUserDto })
  @ApiCreatedResponse({ description: ResponseType.user.create.msg })
  @ApiConflictResponse({ description: ErrorType.user.conflict.msg })
  create(
    @Req() req: Request,
    @Body(ValidationPipe) createUserDto: CreateUserDto,
  ): Promise<User> {
    const offset = new Date().getTimezoneOffset();
    console.log(offset);
    return this.userService.signUp(createUserDto);
  }

  @Get()
  // 스웨거 데코레이터
  @ApiOperation({
    summary: '유저 전체 조회',
    description: '유저 전체 조회',
  })
  @ApiResponse({
    status: 200,
    description: '전체 유저를 성공적으로 조회했습니다.',
    type: [User],
  })
  findAll(): Promise<User[]> {
    return this.userService.findAll();
  }

  @Get()
  @UseGuards(AuthGuard('access'))
  @ApiOperation({ summary: '유저 조회', description: '유저를 조회합니다.' })
  // 스웨거 데코레이터
  @ApiBearerAuth('access_token')
  @ApiResponse({ description: ResponseType.user.fetch.msg })
  @ApiForbiddenResponse({ description: ErrorType.user.forbidden.msg })
  @ApiNotFoundResponse({ description: ErrorType.user.notFound.msg })
  fetch(@CurrentUser() currentUser: ICurrentUser): Promise<User> {
    return this.userService.findOne(currentUser);
  }

  @Patch()
  @UseGuards(AuthGuard('access'))
  @ApiOperation({ summary: '유저 수정', description: '정보를 수정합니다.' })
  // 스웨거 데코레이터
  @ApiBearerAuth('access_token')
  @ApiBody({ type: UpdateUserDto })
  @ApiResponse({ description: ResponseType.user.update.msg })
  @ApiForbiddenResponse({ description: ErrorType.user.forbidden.msg })
  @ApiNotFoundResponse({ description: ErrorType.user.notFound.msg })
  update(
    @CurrentUser() currentUser: ICurrentUser,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<User> {
    return this.userService.update(currentUser, updateUserDto);
  }

  @Delete()
  @UseGuards(AuthGuard('access'))
  @ApiOperation({ summary: '유저 삭제', description: '유저를 삭제합니다.' })
  // 스웨거 데코레이터
  @ApiBearerAuth('access_token')
  @ApiResponse({ description: ResponseType.user.delete.msg })
  @ApiForbiddenResponse({ description: ErrorType.user.forbidden.msg })
  @ApiNotFoundResponse({ description: ErrorType.user.notFound.msg })
  delete(@CurrentUser() currentUser: ICurrentUser): Promise<boolean> {
    return this.userService.delete(currentUser);
  }
}
