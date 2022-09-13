import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class GetDateParams {
  @ApiProperty({ description: '날짜' })
  date: Date;
}

export class GetTaskParams {
  @ApiProperty({ description: '조회할 Task ID' })
  id: number;
}

export class UpdateTaskParams extends GetTaskParams {
  @ApiPropertyOptional({ description: '상태값' })
  @IsBoolean({ message: '상태값은 boolean형식이어야 합니다.' })
  @IsOptional()
  status?: boolean;
}

export class CreateTaskDTO extends GetDateParams {
  @ApiProperty({
    example: '이닦기',
    description: '할일의 제목',
    required: true,
  })
  @IsNotEmpty({ message: '공백으로 남겨놓으실 수 없습니다.' })
  @IsString({ message: '문자열만 입력이 가능합니다.' })
  title: string;

  @ApiProperty({
    example: '한번에 3분씩',
    description: '할일의 설명',
    required: true,
  })
  @IsNotEmpty({ message: '공백으로 남겨놓으실 수 없습니다.' })
  @IsString({ message: '문자열만 입력이 가능합니다.' })
  content: string;
}

export class UpdateTaskDTO extends PartialType(CreateTaskDTO) {}
