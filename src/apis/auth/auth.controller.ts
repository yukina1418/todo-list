import { Controller, Post, Body, Res, UseGuards } from '@nestjs/common';
import {
  ApiBody,
  ApiForbiddenResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login-dto';
import { Response } from 'express';
import { CurrentUser, ICurrentUser } from 'src/commons/decorator/current-user';
import { JwtRefreshStrategy } from 'src/commons/strategy/jwt-refresh-strategy';

@ApiTags('auth')
@Controller({ version: '1.0' })
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * @summary 로그인 API
   * @description 로그인 요청시 새로운 액세스 토큰을 반환하고 쿠키에 리프레시 토큰을 넣습니다.
   * @param res
   * @param loginDto
   * @returns {string}
   */
  @Post('login')
  // 스웨거 설정
  @ApiBody({ type: LoginDto })
  @ApiOperation({ summary: '로그인', description: '로그인 API입니다' })
  @ApiResponse({
    status: 201,
    description: '로그인을 성공했습니다.',
    schema: { type: 'string', example: '암호화된 액세스 토큰' },
  })
  @ApiUnauthorizedResponse({
    status: 401,
    description: '로그인을 실패했습니다.',
    schema: {
      type: 'Error',
      example: '아이디 혹은 비밀번호가 일치하지 않습니다.',
    },
  })
  async login(
    @Res({ passthrough: true }) res: Response,
    @Body() loginDto: LoginDto,
  ): Promise<string> {
    const user = await this.authService.checkUser(loginDto);

    this.authService.getRefreshToken(user, res);
    return this.authService.getAccessToken({ user });
  }

  /**
   * @summary 액세스 토큰 재발급 API
   * @description 액세스 토큰이 만료됐을 경우, 쿠키에 존재하는 리프레시 토큰을 검증하여 새로운 액세스 토큰을 반환합니다.
   * @param currentUser
   * @returns {string}
   */
  @Post('restoreAccessToken')
  @UseGuards(JwtRefreshStrategy)
  // 스웨거 설정
  @ApiOperation({
    summary: '액세스 토큰 재발행',
    description: '액세스 토큰 재발행 API입니다',
  })
  @ApiResponse({
    status: 201,
    description: '액세스 토큰 재발행을 성공했습니다.',
    schema: { type: 'string', example: '암호화된 액세스 토큰' },
  })
  @ApiForbiddenResponse({
    status: 403,
    description: '액세스 토큰 재발행을 실패했습니다.',
    schema: {
      type: 'Error',
      example: '아이디 혹은 비밀번호가 일치하지 않습니다.',
    },
  })
  async restoreAccessToken(
    @CurrentUser() currentUser: ICurrentUser,
  ): Promise<string> {
    return this.authService.getAccessToken({ user: currentUser });
  }
}
