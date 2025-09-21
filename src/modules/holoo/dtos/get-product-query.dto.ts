import { StringFieldOptional } from '../../../decorators/field.decorators';

export class GetProductQuery {
  @StringFieldOptional()
  name?: string;

  @StringFieldOptional()
  code?: string;

  @StringFieldOptional()
  erpcode?: string;
}
