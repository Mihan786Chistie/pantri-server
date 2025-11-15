import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compare } from 'bcrypt';
import { UsersService } from 'src/users/users.service';
import { AuthJwtPayload } from './types/auth-jwtPayload';
import refreshJwtConfig from './config/refresh-jwt.config';
import { ConfigType } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly jwtService: JwtService,
    @Inject(refreshJwtConfig.KEY)
    private refreshTokenConfiguration: ConfigType<typeof refreshJwtConfig>,
  ) {}

  async validateUser(email: string, password: string) {
    const user = await this.userService.findByEmail(email);
    if (!user) throw new UnauthorizedException('User not found');
    const isMatch = await compare(password, user.password);
    if (!isMatch) throw new UnauthorizedException('Invalid credentails');

    return { id: user.id };
  }

  async login(userId: number) {
    const payload: AuthJwtPayload = { sub: userId };
    const token = this.jwtService.sign(payload);
    const refreshToken = this.jwtService.sign(
      payload,
      this.refreshTokenConfiguration,
    );

    return {
      id: userId,
      token,
      refreshToken,
    };
  }

  async refreshToken(userId: number) {
    const payload: AuthJwtPayload = { sub: userId };
    const token = this.jwtService.sign(payload);

    return {
      id: userId,
      token,
    };
  }
}
