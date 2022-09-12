import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

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
