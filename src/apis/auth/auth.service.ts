import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../user/user.entity';
import { LoginDto } from './dto';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Response } from 'express';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  /**
   * @summary 유저 조회
   * @description 로그인 요청시 입력받은 이메일과 비밀번호로 유저를 조회합니다.
   * @param loginDto
   * @returns {Promise<User>}
   */
  async checkUser(loginDto: LoginDto): Promise<User> {
    const { email, password } = loginDto;

    const userData = await this.userRepository.findOne({
      where: { email: email },
    });

    if (!userData)
      throw new UnauthorizedException(
        '아이디 혹은 비밀번호가 일치하지 않습니다.',
      );

    const isMatched = await bcrypt.compare(password, userData.password);

    if (!isMatched)
      throw new UnauthorizedException(
        '아이디 혹은 비밀번호가 일치하지 않습니다.',
      );

    return userData;
  }

  /**
   * @summary 리프레시 토큰 생성
   * @description 유저의 정보를 토대로 리프레시 토큰을 발급하여 쿠키에 세팅합니다.
   * @param user
   * @param res
   * @returns {void}
   */
  getRefreshToken(user: User, res: Response): void {
    try {
      const refresh = this.jwtService.sign(
        { id: user.id },
        {
          secret: process.env.REFRESH_SECRET_KEY,
          expiresIn: process.env.REFRESH_EXPIRATION_TIME,
        },
      );

      res.setHeader(
        'Access-Control-Allow-Origin',
        `${process.env.ALLOW_ORIGIN_URL}`,
      );
      res.setHeader(
        'Set-Cookie',
        `refreshToken=${refresh}; path=/; domain=https://project-back.shop; SameSite=None; Secure; httpOnly;`,
      );
    } catch (e) {
      throw e;
    }
  }

  /**
   * @summary 액세스 토큰 생성
   * @description 유저의 정보를 토대로 액세스 토큰을 발급하여 반환합니다.
   * @param user
   * @returns {string}
   */
  getAccessToken({ user }): string {
    try {
      const access = this.jwtService.sign(
        { id: user.id },
        {
          secret: process.env.ACCESS_SECRET_KEY,
          expiresIn: process.env.ACCESS_EXPIRATION_TIME,
        },
      );

      return access;
    } catch (e) {
      throw e;
    }
  }
}
