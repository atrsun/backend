import { HolooCustomerApis } from './../holoo/apis/holoo.customer';
import {
  Inject,
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';
import type { FilterQuery } from 'mongoose';
import { UserEntity } from './user.entity';
import { UserDto } from './dtos/user.dto';
import { UserNotFoundException } from '../../exceptions/user-not-found.exception';
import { validateHash } from '../../common/utils';
import { UserRepository } from './user.repository';
import { Cron, CronExpression } from '@nestjs/schedule';
@Injectable()
export class UserService {
  constructor(
    @Inject(UserRepository)
    private userRepository: UserRepository,
    private holooCustomerApis: HolooCustomerApis,
  ) {}

  async findOne(findData: FilterQuery<UserEntity>): Promise<UserEntity | null> {
    return await this.userRepository.findOne(findData);
  }

  async validatePassword(user: UserEntity, password: string): Promise<UserDto> {
    if (!user) {
      throw new UserNotFoundException();
    }

    const isPasswordValid = await validateHash(password, user.Password);

    if (!isPasswordValid) {
      throw new UnprocessableEntityException('credentials error!');
    }

    return user.toDto()!;
  }

  async getCurrentSellerUsers(user: UserEntity) {
    const users = await this.userRepository.find({
      'Vaseteh.ErpCode': user.ErpCode,
    });

    return this.transferToDto(users);
  }

  async filterUser(name: string, vaset: UserEntity) {
    const filter: FilterQuery<UserEntity> = {
      Name: { $regex: name, $options: 'i' },
      'Vaseteh.ErpCode': vaset?.ErpCode,
    };

    const users = await this.userRepository.find(filter);

    return this.transferToDto(users);
  }

  @Cron(CronExpression.EVERY_4_HOURS)
  async updateUsers() {
    let page = 1;
    const limit = 50;
    let isUserLeft = true;

    const getUsers = async (page: number, limit: number) => {
      return await this.userRepository.find({}, page, limit);
    };

    while (isUserLeft) {
      const users = await getUsers(page, limit);

      if (users.length === 0) {
        isUserLeft = false;
        break;
      }

      for (let i = 0; i < users.length; i++) {
        const currentUser = users[i];

        try {
          if (currentUser?.ErpCode) {
            const userFromHoloo =
              await this.holooCustomerApis.getCustomerByErpCode(
                currentUser.ErpCode!,
              );

            const { Credit, Mandeh } = {
              Credit: userFromHoloo.Customer[0].Credit,
              Mandeh: userFromHoloo.Customer[0].Mandeh,
            };
            await this.userRepository.update(
              { _id: currentUser._id },
              { Mandeh, Credit },
            );
          }
        } catch (error) {
          console.log('error happens on updating user...');
        }
      }
      page++;
    }
  }

  transferToDto(users: UserEntity[]) {
    const normalizedUsers = users.map((u) => u.toDto());

    return normalizedUsers;
  }
}
