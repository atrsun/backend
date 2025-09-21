import { ApiPropertyOptional } from '@nestjs/swagger';
import { NumberFieldOptional } from '../../decorators/field.decorators';

export class PaginationDto {
  @ApiPropertyOptional({ default: 50, minimum: 1, maximum: 100 })
  @NumberFieldOptional({ min: 1, max: 100 })
  limit?: number;

  @ApiPropertyOptional({ default: 1, minimum: 1 })
  @NumberFieldOptional({ min: 1 })
  page?: number;

  constructor(partial?: Partial<PaginationDto>) {
    if (partial) {
      Object.assign(this, partial);
    }

    if (this.limit == null) {
      this.limit = 50;
    }
    if (this.page == null) {
      this.page = 1;
    }
  }
}
