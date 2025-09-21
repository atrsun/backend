import { ApiPropertyOptional } from '@nestjs/swagger';
import { StringFieldOptional } from '../../../decorators/field.decorators';

export class FilterCustomerDto {
  @ApiPropertyOptional({ type: 'string', description: 'user phone number' })
  @StringFieldOptional()
  phone?: string;

  @ApiPropertyOptional({ type: 'string', description: 'name of user' })
  @StringFieldOptional()
  name?: string;
}
