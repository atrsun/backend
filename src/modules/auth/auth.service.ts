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
    console.log(`[DEBUG] Setting cookie: ${name}, maxAge: ${maxAge}ms, secure: true, sameSite: 'none'`);
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
    console.log(`[DEBUG] Creating access token for user: ${data.userId}, isVaset: ${data.isVaset}`);
    
    const accessToken = await this.jwtService.signAsync({
      uuid: data.userId,
      type: TokenType.ACCESS_TOKEN,
      isVaset: data.isVaset,
    });

    console.log(`[DEBUG] Token created successfully for user: ${data.userId}`);
    return new TokenPayloadDto({
      expiresIn: this.configService.authConfig.jwtExpirationTime,
      accessToken,
    });
  }

  async login(dto: UserLoginDto, res: Response): Promise<LoginPayloadDto> {
    console.log(`[LOG] >>> Starting login process for email: ${dto.email}`);
    
    try {
      const { email, password } = dto;
      console.log('[DEBUG] Step 1: Fetching user by email');
      
      let user = await this.userService.findOne({ Email: email });
      console.log(`[DEBUG] User found in DB: ${user ? 'YES' : 'NO'}`);

      if (!user) {
        console.log(`[WARN] ❌ User not found with email: ${email}`);
        throw new NotFoundException('User not found');
      }

      console.log('[DEBUG] Step 2: Validating password');
      const isValidPassword = await this.userService.validatePassword(user, password);
      console.log(`[DEBUG] Password validation result: ${isValidPassword ? 'VALID' : 'INVALID'}`);

      if (!isValidPassword) {
        console.log(`[WARN] ❌ Invalid password for user: ${email}`);
        throw new NotFoundException('User not found');
      }

      console.log('[DEBUG] Step 3: Generating access token');
      const token = await this.createAccessToken({
        userId: user._id as string,
        isVaset: user.IsVaseteh || false,
      });
      console.log('[DEBUG] ✅ Access token generated successfully');

      console.log('[DEBUG] Step 4: Setting auth cookie');
      const cookieMaxAge = 1000 * 60 * 60 * 24 * 30; // 30 days
      this.setCookie(res, TokenType.ACCESS_TOKEN, token.accessToken, cookieMaxAge);
      
      const outPut = { 
        token, 
        user: user.toDto(),
        debug: {
          cookieSet: true,
          responseSentFromService: false
        }
      };
      
      console.log(`[DEBUG] Step 5: Preparing response data. User ID: ${user._id}`);
      
      console.log(`[LOG] ✅ Login process completed successfully for user: ${user._id}`);
      return outPut;

    } catch (error) {
      console.log(`[ERROR] 🔥 Login process failed: ${error.message}`, error.stack);
      throw error;
    }
  }
}