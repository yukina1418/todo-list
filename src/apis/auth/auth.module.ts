import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtRefreshStrategy } from 'src/commons/strategy/jwt-refresh-strategy';
import { User } from '../user/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [JwtModule.register({}), TypeOrmModule.forFeature([User])],
  controllers: [AuthController],
  providers: [AuthService, JwtRefreshStrategy],
})
export class AuthModule {}
