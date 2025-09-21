import { StringField, StringFieldOptional } from '../../../decorators/field.decorators';

export class HolooCustomerDto {
  @StringField()
  EconomicId!: string;

  @StringField()
  IsPurchaser!: boolean;

  @StringField()
  IsSeller!: boolean;

  @StringField()
  IsBlackList!: boolean;

  @StringField()
  IsVaseteh!: boolean;

  @StringField()
  VasetehPorsant!: number;

  @StringField()
  Mandeh!: number;

  @StringField()
  Credit!: number;

  @StringField()
  ErpCode!: string;

  @StringField()
  type!: number;

  @StringField()
  IsActive!: true;

  @StringField()
  selectedPriceType!: number;

  @StringField()
  isAmer!: boolean;

  @StringFieldOptional()
  Code?: string;

  @StringFieldOptional()
  Name?: string;

  @StringFieldOptional()
  BesSarfasl?: string;

  @StringFieldOptional()
  Mobile?: string;

  @StringFieldOptional()
  WebId?: string;
}
