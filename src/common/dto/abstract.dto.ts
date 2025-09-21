import { DateFieldOptional } from '../../decorators/field.decorators.ts';
import type { AbstractEntity } from '../abstract.entity.ts';

export class AbstractDto {
  @DateFieldOptional()
  createdAt?: Date;

  @DateFieldOptional()
  updatedAt?: Date;

  constructor(entity: AbstractEntity) {
    this.createdAt = entity.createdAt;
    this.updatedAt = entity.updatedAt;
  }
}
