import { ApiProperty } from '@nestjs/swagger';
import {
  ClassField,
  NumberField,
  NumberFieldOptional,
  StringField,
} from '../../../decorators/field.decorators';

export class ProductInfo {
  @ApiProperty({ type: 'string', description: 'product ErpCode' })
  @StringField()
  product_variant_erpcode!: string;

  @ApiProperty({ type: 'number' })
  @NumberField()
  quantity!: number;

  @ApiProperty({ type: 'number' })
  @NumberField()
  price!: number;
  
  @ApiProperty({ type: 'string' })
  @NumberField()
  discount_percent!: number;

  @ApiProperty({ type: 'string', example: 'name of product' })
  @StringField()
  productName!: string;

  @ApiProperty({ type: 'string', example: 'code of product' })
  @StringField()
  productCode!: string;
}

export class CreatePreInvoiceDto {
  @ApiProperty({
    description: `array of product infos with this fields => {product_variant_erpcode : string
quantity: number
price: number}`,
  })
  @ClassField(() => ProductInfo, { isArray: true })
  productInfo!: ProductInfo[];

  @ApiProperty({ type: 'string' })
  @StringField()
  costumerErpCode!: string;

  @ApiProperty({ type: 'string' })
  @NumberFieldOptional()
  discountPercent!: number;
}
