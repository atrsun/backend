import { Injectable, NotFoundException } from '@nestjs/common';
import { UserLoginDto } from './dto/user-login.dto';
import { LoginPayloadDto } from './dto/login-payload.dto';
import { TokenPayloadDto } from './dto/token-payload.dto';
import { JwtService } from '@nestjs/jwt';
import { ApiConfigService } from '../../shared/services/api-config.service';
import { TokenType } from '../../constants/token-type';
import { UserService } from '../../modules/user/user.service';
import type { Response } from 'express';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private configService: ApiConfigService,
    private userService: UserService,
  ) {}

  setCookie(res: Response, name: string, value: string, maxAge: number) {
    res.cookie(name, value, {
      httpOnly: true,
      secure: true,
      maxAge,
      sameSite: 'none',
    });
  }

  async createAccessToken(data: {
    userId: string;
    isVaset: boolean;
  }): Promise<TokenPayloadDto> {
    return new TokenPayloadDto({
      expiresIn: this.configService.authConfig.jwtExpirationTime,
      accessToken: await this.jwtService.signAsync({
        uuid: data.userId,
        type: TokenType.ACCESS_TOKEN,
        isVaset: data.isVaset,
      }),
    });
  }

  async login(dto: UserLoginDto, res: Response): Promise<LoginPayloadDto> {
    const { email, password } = dto;

    // Check if user exists based on phone number.
    let user = await this.userService.findOne({ Email: email });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const isValidPassword = await this.userService.validatePassword(
      user,
      password,
    );

    if (!isValidPassword) {
      throw new NotFoundException('User not found');
    }

    const token = await this.createAccessToken({
      userId: user._id as string,
      isVaset: user.IsVaseteh || false,
    });

    this.setCookie(
      res,
      TokenType.ACCESS_TOKEN,
      token.accessToken,
      1000 * 60 * 60 * 24 * 30,
    ); // one month

    const outPut = { token, user: user.toDto() };

    res.json(outPut);

    return outPut;
  }
}
