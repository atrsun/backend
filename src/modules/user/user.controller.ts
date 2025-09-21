import { Controller, Get, HttpCode, HttpStatus, Query } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { UserService } from './user.service';
import { AuthUser } from '../../decorators/auth-user.decorator';
import { UserEntity } from './user.entity';
import { Auth } from '../../decorators/http.decorators';
import { UserDto } from './dtos/user.dto';
import { FilterUserDto } from './dtos/filter-user.dto';

@Controller('users')
@ApiTags('users')
export class UserController {
  constructor(private userService: UserService) {}

  @Get('currentSellerUsers')
  @HttpCode(HttpStatus.OK)
  @Auth([])
  @ApiOkResponse({
    type: [UserDto],
    description: 'get current seller all users that are is vaset of them',
  })
  async getCurrentSellerUsers(@AuthUser() user: UserEntity) {
    return await this.userService.getCurrentSellerUsers(user);
  }

  //   @Get('/addUsersDb')
  //   async addUsersDb() {
  //     return await this.userService.addUsersDb();
  //   }

  //   @Get('/getSellersInfos')
  //   getSellersInfos() {
  //     return this.userService.getSellersInfos;
  //   }

  @Get('filterUsers')
  @Auth([])
  async filterUsers(
    @Query() filterUserDto: FilterUserDto,
    @AuthUser() user: UserEntity,
  ) {
    const { name } = filterUserDto;
    return await this.userService.filterUser(name, user);
  }
}
