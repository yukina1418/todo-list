import { Res, Post, Body, UseGuards, Controller, HttpException, InternalServerErrorException } from '@nestjs/common';
import {
  ApiBody,
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiOkResponse,
  ApiForbiddenResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { Response } from 'express';

import { LoginDto } from './dto';
import { AuthService } from './auth.service';

import { ErrorType, ResponseType } from '@app/swagger/response-message';
import { CurrentUser, ICurrentUser } from '@app/decorator/decorators';

@ApiTags('인증')
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
  @ApiOkResponse({ description: ResponseType.auth.login.msg })
  @ApiUnauthorizedResponse({ description: ErrorType.auth.unauthorized.msg })
  async login(@Res({ passthrough: true }) res: Response, @Body() loginDto: LoginDto): Promise<string> {
    const user = await this.authService.checkUser(loginDto).catch((err: unknown) => {
      if (err instanceof HttpException) {
        throw err;
      }
      throw new InternalServerErrorException('로그인 실패 서버 오류');
    });

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
  @UseGuards(AuthGuard('refresh'))
  @ApiOperation({
    summary: '액세스 토큰 재발행',
    description: '액세스 토큰 재발행 API입니다',
  })
  // 스웨거 데코레이터
  @ApiBearerAuth('refresh_token')
  @ApiOkResponse({ description: ResponseType.auth.restoreAccessToken.msg })
  @ApiForbiddenResponse({ description: ErrorType.auth.forbidden.msg })
  async restoreAccessToken(@CurrentUser() currentUser: ICurrentUser): Promise<string> {
    return this.authService.getAccessToken({ user: currentUser });
  }
}
