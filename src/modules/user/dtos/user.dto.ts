import { AbstractDto } from '../../../common/dto/abstract.dto.ts';
import { UserEntity, type VasetehItem } from '../user.entity.ts';
import {
  BooleanField,
  EmailField,
  NumberField,
  NumberFieldOptional,
  StringField,
  StringFieldOptional,
} from '../../../decorators/field.decorators.ts';

export class UserDto extends AbstractDto {
  @EmailField()
  Email?: string;

  @StringFieldOptional()
  Code?: string;

  @StringFieldOptional()
  Name?: string;

  @StringFieldOptional()
  BedSarfasl?: string;

  @BooleanField()
  IsPurchaser?: boolean;

  @BooleanField()
  IsSeller?: boolean;

  @BooleanField()
  IsBlackList?: boolean;

  @BooleanField()
  IsVaseteh?: boolean;

  @NumberFieldOptional()
  VasetehPorsant?: number;

  @NumberFieldOptional()
  Mandeh?: number;

  @NumberFieldOptional()
  Credit?: number;

  @StringFieldOptional()
  Tel?: string;

  @StringFieldOptional()
  Mobile?: string;

  @StringFieldOptional()
  City?: string;

  @StringFieldOptional()
  Ostan?: string;

  @StringFieldOptional()
  Address?: string;

  @StringField()
  ErpCode?: string;

  @NumberField()
  type?: number;

  @BooleanField()
  IsActive?: boolean;

  @NumberField()
  selectedPriceType?: number;

  @BooleanField()
  isAmer?: boolean;

  Vaseteh?: VasetehItem[];

  constructor(user: UserEntity) {
    super(user);
    this.Email = user.Email;
    this.Code = user.Code;
    this.Name = user.Name;
    this.BedSarfasl = user.BedSarfasl;
    this.IsPurchaser = user.IsPurchaser;
    this.IsSeller = user.IsSeller;
    this.IsBlackList = user.IsBlackList;
    this.IsVaseteh = user.IsVaseteh;
    this.VasetehPorsant = user.VasetehPorsant;
    this.Mandeh = user.Mandeh;
    this.Credit = user.Credit;
    this.Tel = user.Tel;
    this.Mobile = user.Mobile;
    this.City = user.City;
    this.Ostan = user.Ostan;
    this.Address = user.Address;
    this.ErpCode = user.ErpCode;
    this.type = user.type;
    this.IsActive = user.IsActive;
    this.selectedPriceType = user.selectedPriceType;
    this.isAmer = user.isAmer;
    this.Vaseteh = user.Vaseteh;
  }
}
