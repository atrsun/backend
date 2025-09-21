import { AbstractDto } from '../../../common/dto/abstract.dto';
import { PreInvoiceEntity, type PreInvoiceDetail } from '../pre-invoice.entity';
import {
  StringFieldOptional,
  NumberFieldOptional,
  StringField,
  BooleanFieldOptional,
} from '../../../decorators/field.decorators';

export class PreInvoiceDto extends AbstractDto {
  @StringFieldOptional()
  Code?: string;

  @StringFieldOptional()
  Type?: string;

  @NumberFieldOptional()
  SanadCode?: number;

  @StringFieldOptional()
  CustomerName?: string;

  @StringFieldOptional()
  customerCodeC?: string;

  @StringFieldOptional()
  Date?: string;

  @StringFieldOptional()
  Time?: string;

  @NumberFieldOptional()
  SumNaghd?: number;

  @NumberFieldOptional()
  SumCard?: number;

  @NumberFieldOptional()
  SumNesiyeh?: number;

  @NumberFieldOptional()
  SumDiscount?: number;

  @NumberFieldOptional()
  SumCheck?: number;

  @NumberFieldOptional()
  SumLevy?: number;

  @NumberFieldOptional()
  SumScot?: number;

  @NumberFieldOptional()
  SumPrice?: number;

  @StringFieldOptional()
  ErpCode?: string;

  @StringFieldOptional()
  CustomerErpCode?: string;

  @StringFieldOptional()
  TypeName?: string;

  // Here we directly declare Detail as an array of detail DTOs.
  Detail?: PreInvoiceDetail[];

  @NumberFieldOptional()
  totalPrice?: number;

  @BooleanFieldOptional()
  isConverted?: boolean;

  @StringFieldOptional()
  VasetErpCode?: string;

  @StringField()
  _id!: string;

  constructor(preInvoice: PreInvoiceEntity) {
    super(preInvoice);
    this.Code = preInvoice.Code;
    this.Type = preInvoice.Type;
    this.SanadCode = preInvoice.SanadCode;
    this.CustomerName = preInvoice.CustomerName;
    this.customerCodeC = preInvoice.customerCodeC;
    this.Date = preInvoice.Date;
    this.Time = preInvoice.Time;
    this.SumNaghd = preInvoice.SumNaghd;
    this.SumCard = preInvoice.SumCard;
    this.SumNesiyeh = preInvoice.SumNesiyeh;
    this.SumDiscount = preInvoice.SumDiscount;
    this.SumCheck = preInvoice.SumCheck;
    this.SumLevy = preInvoice.SumLevy;
    this.SumScot = preInvoice.SumScot;
    this.SumPrice = preInvoice.SumPrice;
    this.ErpCode = preInvoice.ErpCode;
    this.CustomerErpCode = preInvoice.CustomerErpCode;
    this.TypeName = preInvoice.TypeName;
    this.Detail = preInvoice.Detail || [];
    this.totalPrice = preInvoice.totalPrice;
    this.VasetErpCode = preInvoice.VasetErpCode;
    this._id = preInvoice._id as string;
  }
}
