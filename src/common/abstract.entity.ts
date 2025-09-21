import { Document } from 'mongoose';
import { AbstractDto } from './dto/abstract.dto';

/**
 * Abstract Entity for Mongoose.
 *
 * @description This abstract class serves as a base for all Mongoose entities.
 * It assumes that timestamps are enabled on the schema to automatically manage
 * `createdAt` and `updatedAt` fields. If a UUID is required, you can generate it
 * using an appropriate library like `uuid` and assign it during document creation.
 */

export abstract class AbstractEntity<
  DTO extends AbstractDto = AbstractDto,
> extends Document {
  createdAt!: Date;
  updatedAt!: Date;

  toDto(): DTO {
    const dtoClass = (this.constructor as any).dtoClass;
    if (!dtoClass) {
      throw new Error(
        `You need to set a static dtoClass on class (${this.constructor.name}) to be able to call toDto()`,
      );
    }

    return new dtoClass(this.toJSON());
  }
}
