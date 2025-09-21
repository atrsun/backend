import { AbstractDto } from '../../../common/dto/abstract.dto';
import { InvoiceEntity } from '../invoice.entity';
import {
  StringFieldOptional,
  NumberFieldOptional,
  StringField,
} from '../../../decorators/field.decorators';

export class InvoiceDto extends AbstractDto {
  @StringFieldOptional()
  Code?: number;

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

  @NumberFieldOptional()
  totalPrice?: number;

  @StringFieldOptional()
  VasetErpCode?: string;

  @StringField()
  _id!: string;

  // Detail field: Array of products in the invoice
  Detail?: any[];

  constructor(invoice: InvoiceEntity) {
    super(invoice);
    this.Code = invoice.Code;
    this.Type = invoice.Type;
    this.SanadCode = invoice.SanadCode;
    this.CustomerName = invoice.CustomerName;
    this.customerCodeC = invoice.customerCodeC;
    this.Date = invoice.Date;
    this.Time = invoice.Time;
    this.SumNaghd = invoice.SumNaghd;
    this.SumCard = invoice.SumCard;
    this.SumNesiyeh = invoice.SumNesiyeh;
    this.SumDiscount = invoice.SumDiscount;
    this.SumCheck = invoice.SumCheck;
    this.SumLevy = invoice.SumLevy;
    this.SumScot = invoice.SumScot;
    this.SumPrice = invoice.SumPrice;
    this.ErpCode = invoice.ErpCode;
    this.CustomerErpCode = invoice.CustomerErpCode;
    this.TypeName = invoice.TypeName;
    this.VasetErpCode = invoice.VasetErpCode;
    this._id = invoice._id as unknown as string;
    this.Detail = invoice.Detail || [];
  }
}
