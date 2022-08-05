import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ValidationPipe,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import {
  ApiBody,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { User } from './entities/user.entity';

@ApiTags('user')
@Controller({ path: 'user', version: '1.0' })
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @ApiBody({ type: CreateUserDto })
  @ApiOperation({
    summary: '유저 생성',
    description: '유저를 생성합니다.',
  })
  @ApiCreatedResponse({
    description: '유저 생성 성공시',
    type: User,
  })
  @ApiConflictResponse({
    description: '유저 생성 실패시',
    status: 409,
    schema: {
      type: 'string',
      example: '사용할 수 없는 이메일입니다.',
    },
  })
  create(@Body(ValidationPipe) createUserDto: CreateUserDto): Promise<User> {
    return this.userService.create(createUserDto);
  }

  @Get()
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

  @Get(':id')
  @ApiParam({
    name: 'email',
    type: String,
    example: 'nestjs@gmail.com',
    required: true,
  })
  @ApiOperation({
    summary: '유저 조회',
    description: '유저를 조회합니다.',
  })
  @ApiResponse({
    status: 200,
    description: '유저 조회 성공시',
    type: User,
  })
  @ApiNotFoundResponse({
    description: '유저 조회 실패시',
    status: 404,
    schema: { type: 'string', example: '유저 정보가 존재하지 않습니다.' },
  })
  findOne(@Param('nickName') nickName: string): Promise<User> {
    return this.userService.findOne(nickName);
  }

  @Patch(':id')
  @ApiParam({
    name: 'email',
    type: String,
    example: 'nestjs@gmail.com',
    required: true,
  })
  @ApiBody({ type: UpdateUserDto })
  @ApiOperation({
    summary: '유저 수정',
    description: '유저를 수정합니다.',
  })
  @ApiResponse({
    status: 200,
    description: '유저 수정 성공시',
    schema: { type: 'string', example: '계정 정보가 수정되었습니다.' },
  })
  @ApiNotFoundResponse({
    description: '유저 수정 실패시',
    status: 404,
    schema: { type: 'string', example: '유저 정보가 존재하지 않습니다.' },
  })
  update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<User> {
    return this.userService.update(id, updateUserDto);
  }

  @Delete(':id')
  @ApiParam({
    name: 'email',
    type: String,
    example: 'nestjs@gmail.com',
    required: true,
  })
  @ApiOperation({
    summary: '유저 삭제',
    description: '유저를 삭제합니다.',
  })
  @ApiResponse({
    status: 200,
    description: '유저 삭제 성공시',
    schema: {
      type: 'boolean',
      example: true,
    },
  })
  @ApiNotFoundResponse({
    description: '유저 삭제 실패시',
    status: 404,
    schema: {
      type: 'string',
      example: '유저 정보가 존재하지 않습니다.',
    },
  })
  delete(@Param('id') id: string): Promise<boolean> {
    return this.userService.delete(id);
  }
}
