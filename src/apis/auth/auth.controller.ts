import {
  Controller,
  Post,
  Body,
  Res,
  UseGuards,
  InternalServerErrorException,
  HttpException,
} from '@nestjs/common';
import {
  ApiBearerAuth,
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
import { ResponseType } from 'src/commons/type/response-type';
import { ErrorType } from 'src/commons/type/error-type';
import { AuthGuard } from '@nestjs/passport';

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
  @ApiResponse({ description: ResponseType.auth.login.msg })
  @ApiUnauthorizedResponse({ description: ErrorType.auth.unauthorized.msg })
  async login(
    @Res({ passthrough: true }) res: Response,
    @Body() loginDto: LoginDto,
  ): Promise<string> {
    const user = await this.authService
      .checkUser(loginDto)
      .catch((err: unknown) => {
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
  @ApiResponse({ description: ResponseType.auth.restoreAccessToken.msg })
  @ApiForbiddenResponse({ description: ErrorType.auth.forbidden.msg })
  async restoreAccessToken(
    @CurrentUser() currentUser: ICurrentUser,
  ): Promise<string> {
    return this.authService.getAccessToken({ user: currentUser });
  }
}
