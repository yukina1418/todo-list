import { ForbiddenException, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtAccessStrategy extends PassportStrategy(Strategy, 'access') {
  constructor() {
    super({
      //
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.ACCESS_SECRET_KEY,
      passReqToCallback: true,
    });
  }

  validate(req: Request, payload: any) {
    const accessToken = req.headers.authorization.replace('Bearer ', '');

    if (!accessToken) throw new ForbiddenException('액세스 토큰이 없습니다.');

    return {
      id: payload.id,
    };
  }
}
