import { ApiProperty } from '@nestjs/swagger';
import { StringField } from '../../../decorators/field.decorators';

export class GetCustomersAddressDto {
  @ApiProperty({ type: 'string' })
  @StringField()
  customerErpCode!: string;
}
