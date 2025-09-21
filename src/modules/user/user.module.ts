import { Module } from '@nestjs/common';
import { UserController } from './user.controller.ts';
import { UserEntity, UserEntitySchema } from './user.entity.ts';
import { UserService } from './user.service.ts';
import { UserRepository } from './user.repository.ts';
import { MongooseModule } from '@nestjs/mongoose';
import { HolooModule } from '../../modules/holoo/holoo.module.ts';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: UserEntity.name, schema: UserEntitySchema },
    ]),
    HolooModule,
  ],
  controllers: [UserController],
  exports: [UserService],
  providers: [UserService, UserRepository],
})
export class UserModule {}
