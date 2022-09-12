import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString, Max, Min } from 'class-validator';

export class GetTodoListParams {
  @ApiProperty({ description: '조회할 년', type: 'number', example: 2022 })
  @IsNotEmpty()
  @IsNumber()
  @Min(2000)
  @Max(2050)
  year: number;

  @ApiProperty({ description: '조회할 월', type: 'number', example: 9 })
  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  @Max(12)
  month: number;

  @ApiProperty({ description: '조회할 일', type: 'number', example: 12 })
  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  @Max(31)
  day?: number;
}

export class CreateTaskDTO {
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
