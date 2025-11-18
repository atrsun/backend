import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
//   Res,
} from '@nestjs/common';
import { ApiOkResponse } from '@nestjs/swagger';

import { RoleType } from '../../constants/role-type.ts';
import { AuthUser } from '../../decorators/auth-user.decorator.ts';
import { Auth } from '../../decorators/http.decorators.ts';
import { UserDto } from '../user/dtos/user.dto.ts';
import { UserEntity } from '../user/user.entity.ts';
import { AuthService } from './auth.service.ts';
import { LoginPayloadDto } from './dto/login-payload.dto.ts';
import { UserLoginDto } from './dto/user-login.dto.ts';
// import type { Response } from 'express';

@Controller('auth')
// @ApiTags('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
//   @HttpCode(HttpStatus.OK)
//   @ApiOkResponse({ type: UserDto, description: 'Successfully Registered' })
  async userRegister(
    @Body() UserLoginDto: UserLoginDto,
    // @Res() res: Response,
  ): Promise<LoginPayloadDto | {}> {
    try {
        console.log("start Login");
    const aa = await this.authService.login(UserLoginDto, res);
    console.log("aa", aa);
    console.log("end login");
    return aa
    } catch (error) {
        console.log("error",error)
        return {}
    }
  }

  @Get('me')
  @HttpCode(HttpStatus.OK)
  @Auth([RoleType.USER, RoleType.ADMIN])
  @ApiOkResponse({ type: UserDto, description: 'current user info' })
  getCurrentUser(@AuthUser() user: UserEntity): UserDto {
    return user.toDto();
  }
}
