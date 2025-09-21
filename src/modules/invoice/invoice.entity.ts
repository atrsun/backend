import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { AbstractEntity } from '../../common/abstract.entity';
import { InvoiceDto } from './dtos/invoice.dto';
import { UseDto } from '../../decorators/use-dto.decorator';

@Schema({ collection: 'invoices', timestamps: true, versionKey: false })
@UseDto(InvoiceDto)
export class InvoiceEntity extends AbstractEntity<InvoiceDto> {
  @Prop({ required: false })
  Code?: number;

  @Prop({ required: false })
  Type?: string;

  @Prop({ required: false })
  SanadCode?: number;

  @Prop({ required: false })
  CustomerName?: string;

  @Prop({ required: false })
  customerCodeC?: string;

  @Prop({ required: false })
  Date?: string;

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

  @Prop({ required: false })
  CustomerErpCode?: string;

  @Prop({ required: false })
  TypeName?: string;

  @Prop({ required: false })
  totalPrice?: number;

  @Prop({ required: false })
  VasetErpCode?: string;

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
        Discount: { type: Number, required: false },
        ProductErpCode: { type: String, required: false },
        _id: false,
      },
    ],
    default: [],
  })
  Detail!: any[]; // Details for each item in the invoice
}

export const InvoiceEntitySchema = SchemaFactory.createForClass(InvoiceEntity);
InvoiceEntitySchema.loadClass(InvoiceEntity);
InvoiceEntitySchema.statics.dtoClass = InvoiceDto as any;
