import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { UseDto } from '../../decorators/use-dto.decorator';
import { UserDto } from './dtos/user.dto';
import { AbstractEntity } from '../../common/abstract.entity';

export type VasetehItem = {
  ErpCode: string;
  name: string;
  remain: number;
};

@Schema({ collection: 'users', timestamps: true, versionKey: false })
@UseDto(UserDto)
export class UserEntity extends AbstractEntity<UserDto> {
  @Prop({ required: false })
  Email?: string;

  @Prop({ required: false })
  Password?: string;

  @Prop({ required: false })
  Code?: string;

  @Prop({ required: false })
  Name?: string;

  @Prop({ required: false })
  BedSarfasl?: string;

  @Prop({ required: false })
  IsPurchaser?: boolean;

  @Prop({ required: false })
  IsSeller?: boolean;

  @Prop({ required: false })
  IsBlackList?: boolean;

  @Prop({ required: false })
  IsVaseteh?: boolean;

  @Prop({ required: false })
  VasetehPorsant?: number;

  @Prop({ required: false })
  Mandeh?: number;

  @Prop({ required: false })
  Credit?: number;

  @Prop({ required: false })
  Tel?: string;

  @Prop({ required: false })
  Mobile?: string;

  @Prop({ required: false })
  City?: string;

  @Prop({ required: false })
  Ostan?: string;

  @Prop({ required: false })
  Address?: string;

  @Prop({ required: false })
  ErpCode?: string;

  @Prop({ required: false })
  type?: number;

  @Prop({ required: false })
  IsActive?: boolean;

  @Prop({ required: false })
  selectedPriceType?: number;

  @Prop({ required: false })
  isAmer?: boolean;

  // Define Vaseteh as an array of objects with a defined structure.
  @Prop({
    type: [
      {
        ErpCode: { type: String, required: false },
        name: { type: String, required: false },
        remain: { type: Number, required: false },
        _id: false,
      },
    ],
    default: [],
    required: false,
  })
  Vaseteh?: VasetehItem[];
}

export const UserEntitySchema = SchemaFactory.createForClass(UserEntity);

// for changing shape of output data to class instance instead of object
UserEntitySchema.loadClass(UserEntity);
UserEntitySchema.statics.dtoClass = UserDto as any;
