import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { AbstractEntity } from '../../common/abstract.entity';
import { PreInvoiceDto } from './dtos/pre-invoice.dto';
import { UseDto } from '../../decorators/use-dto.decorator';

export type PreInvoiceDetail = {
  Row: number;
  ProductCode: string;
  ProductName: string;
  Few: number;
  Karton: number;
  Price: number;
  SumPrice: number;
  Levy: number;
  Scot: number;
  Discount: number;
  ProductErpCode: string;
};

@Schema({ collection: 'preinvoices', timestamps: true, versionKey: false })
@UseDto(PreInvoiceDto)
export class PreInvoiceEntity extends AbstractEntity<PreInvoiceDto> {
  @Prop({ required: false })
  Code?: string;

  @Prop({ required: false })
  Type?: string;

  @Prop({ required: false })
  SanadCode?: number;

  @Prop({ required: false })
  CustomerName?: string;

  @Prop({ required: false })
  customerCodeC?: string;

  @Prop({ required: false })
  Date?: string; // Consider using Date type if you need date operations

  @Prop({ required: false })
  Time?: string;

  @Prop({ required: false, default: 0 })
  SumNaghd?: number;

  @Prop({ required: false, default: 0 })
  SumCard?: number;

  @Prop({ required: false, default: 0 })
  SumNesiyeh?: number;

  @Prop({ required: false, default: 0 })
  SumDiscount?: number;

  @Prop({ required: false, default: 0 })
  SumCheck?: number;

  @Prop({ required: false, default: 0 })
  SumLevy?: number;

  @Prop({ required: false, default: 0 })
  SumScot?: number;

  @Prop({ required: false, default: 0 })
  SumPrice?: number;

  @Prop({ required: false })
  ErpCode?: string;

  @Prop({ required: true })
  VasetErpCode!: string;

  @Prop({ required: false })
  CustomerErpCode?: string;

  @Prop({ required: false })
  TypeName?: string;

  @Prop({ required: false })
  totalPrice?: number;

  @Prop({ required: false })
  isConverted?: boolean;

  @Prop({
    type: [
      {
        Row: { type: Number, required: false },
        ProductCode: { type: String, required: false },
        ProductName: { type: String, required: false },
        Few: { type: Number, required: false },
        Karton: { type: Number, required: false },
        Price: { type: Number, required: false },
        SumPrice: { type: Number, required: false },
        Levy: { type: Number, required: false },
        Scot: { type: Number, required: false },
        PersentDiscount: { type: Number, required: false },
        discountpercent: { type: Number, required: false },
        Discount: { type: Number, required: false },
        ProductErpCode: { type: String, required: false },
        _id: false,
      },
    ],
    default: [],
  })
  Detail!: PreInvoiceDetail[];
}

export const PreInvoiceEntitySchema =
  SchemaFactory.createForClass(PreInvoiceEntity);

PreInvoiceEntitySchema.loadClass(PreInvoiceEntity);
PreInvoiceEntitySchema.statics.dtoClass = PreInvoiceDto as any;
