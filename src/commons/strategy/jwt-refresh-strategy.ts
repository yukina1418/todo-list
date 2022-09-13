import { ForbiddenException, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { Strategy } from 'passport-jwt';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(Strategy, 'refresh') {
  constructor() {
    super({
      jwtFromRequest: (req: Request) => req.headers.cookie.replace('refreshToken=', ''),
      secretOrKey: process.env.REFRESH_SECRET_KEY,
      passReqToCallback: true,
    });
  }

  validate(req: Request, payload: any) {
    const refreshToken = req.headers?.cookie.replace('refreshToken=', '');

    if (!refreshToken) throw new ForbiddenException('리프레시 토큰이 없습니다.');

    return {
      id: payload.id,
    };
  }
}
