import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    example: '랄라라',
    description: '회원의 닉네임',
    required: true,
  })
  @IsNotEmpty({ message: '공백으로 남겨놓으실 수 없습니다.' })
  @IsString({ message: '문자열만 입력이 가능합니다.' })
  nickName: string;

  @ApiProperty({
    example: 'nestjs@gmail.com',
    description: '회원의 이메일',
    required: true,
  })
  @IsNotEmpty({ message: '공백으로 남겨놓으실 수 없습니다.' })
  @IsEmail({}, { message: '올바른 이메일 형식이 아닙니다.' })
  email: string;

  @ApiProperty({
    example: 'qwe123asd456',
    description: '회원의 비밀번호',
    required: true,
  })
  @IsNotEmpty({ message: '공백으로 남겨놓으실 수 없습니다.' })
  @IsString({ message: '문자열만 입력이 가능합니다.' })
  @MinLength(6, { message: '최소 6자 이상이어야 합니다.' })
  @MaxLength(18, { message: '최대 18자 이하이어야 합니다.' })
  @Matches(/^[a-zA-Z0-9]{6,18}$/, {
    message: '비밀번호는 6~18자리의 영문 혹은 숫자의 조합만 가능합니다.',
  })
  password: string;

  @ApiProperty({
    example: '01012345678',
    description: '회원의 핸드폰 번호',
    required: true,
  })
  @IsNotEmpty({ message: '공백으로 남겨놓으실 수 없습니다.' })
  @MinLength(10, { message: '10자리이상 입력해야만 합니다.' })
  @MaxLength(11, { message: '12자리를 초과할 수는 없습니다.' })
  phone: string;
}