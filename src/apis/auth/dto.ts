import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, Matches, MaxLength, MinLength } from 'class-validator';

export class LoginDto {
  @ApiProperty({ example: 'nestjs@gmail.com' })
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'qwe123asd456' })
  @IsString()
  @MinLength(6, { message: '최소 6자 이상이어야 합니다.' })
  @MaxLength(12, { message: '최대 12자 이하이어야 합니다.' })
  @Matches(/^[a-zA-Z0-9]{6,12}$/, {
    message: '비밀번호는 6~18자리의 영문 혹은 숫자의 조합만 가능합니다.',
  })
  password: string;
}
