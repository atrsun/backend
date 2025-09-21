import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { TokenType } from '../../constants/token-type.ts';
import { ApiConfigService } from '../../shared/services/api-config.service.ts';
import { UserEntity } from '../user/user.entity.ts';
import { UserService } from '../user/user.service.ts';
import type { Request } from 'express';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    configService: ApiConfigService,
    private userService: UserService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request) => {
          if (req.cookies[TokenType.ACCESS_TOKEN]) {
            return req.cookies[TokenType.ACCESS_TOKEN];
          }
          return ExtractJwt.fromAuthHeaderAsBearerToken()(req);
        },
      ]),
      secretOrKey: configService.authConfig.publicKey,
    });
  }

  async validate(args: {
    uuid: string;
    type: TokenType;
    isVaset: boolean;
  }): Promise<UserEntity> {
    const { type, uuid, isVaset } = args;

    if (type !== TokenType.ACCESS_TOKEN || !isVaset) {
      throw new UnauthorizedException();
    }

    const user = await this.userService.findOne({
      _id: uuid,
      IsVaseteh: true,
    });

    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }
}
