import { ApiProperty } from '@nestjs/swagger';
import { StringField } from '../../../decorators/field.decorators';

export class FilterUserDto {
  @ApiProperty({ type: 'string', required: true })
  @StringField({ minLength: 2 })
  name!: string;
}
