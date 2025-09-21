import { InjectModel } from '@nestjs/mongoose';
import { AbstractRepository } from '../../common/abstract.repository';
import { UserEntity } from './user.entity';
import { Injectable } from '@nestjs/common';
import type { Model } from 'mongoose';
@Injectable()
export class UserRepository extends AbstractRepository<UserEntity> {
  constructor(
    @InjectModel(UserEntity.name)
    protected readonly userRepo: Model<UserEntity>,
  ) {
    super(userRepo);
  }
}
