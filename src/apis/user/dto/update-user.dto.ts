import { CreateUserDTO } from './create-user.dto';
import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty, PickType } from '@nestjs/swagger';

export class UpdateUserDTO extends PickType(CreateUserDTO, ['name']) {
  @ApiProperty({
    example: '랄라라',
    description: '회원의 닉네임',
    required: true,
  })
  @IsNotEmpty({ message: '공백으로 남겨놓으실 수 없습니다.' })
  @IsString({ message: '문자열만 입력이 가능합니다.' })
  name: string;
}
