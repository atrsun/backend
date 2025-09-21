import { Model, type FilterQuery } from 'mongoose';
import type { AbstractEntity } from './abstract.entity';
import type { AbstractDto } from './dto/abstract.dto';

export abstract class AbstractRepository<
  T extends AbstractEntity<AbstractDto>,
> {
  constructor(protected readonly model: Model<T>) {}

  /**
   * Create a new entity.
   * @param createDocument - The partial entity data for creation.
   * @returns The created and saved entity.
   */
  async create(createDocument: Partial<T>): Promise<T> {
//    const mymodel= new Schema({...createDocument} as any) 

    const createdEntity = new this.model(createDocument);
    // const createdEntity = new this.model(mymodel);
    return await createdEntity.save();
  }

  /**
   * Find a single entity matching the filter.
   * @param filter - The filter criteria.
   * @returns The found entity or null if not found.
   */
  async findOne(filter: FilterQuery<T>): Promise<T | null> {
    return await this.model.findOne(filter);
  }

  /**
   * Find entities with pagination.
   * @param filter - The filter criteria.
   * @param page - The page number (default is 1).
   * @param limit - The maximum number of entities per page (default is 10).
   * @returns An array of entities.
   */
  async find(
    filter: FilterQuery<T> = {},
    page?: number,
    limit?: number,
  ): Promise<T[]> {
    if (page != null && limit != null) {
      const skip = (page - 1) * limit;
      return await this.model.find(filter).skip(skip).limit(limit).exec();
    } else {
      return await this.model.find(filter).exec();
    }
  }

  /**
   * Update an entity matching the filter.
   * @param filter - The filter criteria.
   * @param updateDocument - The partial entity data to update.
   * @returns The updated entity or null if not found.
   */
  async update(
    filter: FilterQuery<T>,
    updateDocument: Partial<T>,
  ): Promise<T | null> {
    return await this.model
      .findOneAndUpdate(filter, updateDocument, { new: true })
      .exec();
  }

  /**
   * Hard-delete an entity matching the filter.
   * @param filter - The filter criteria.
   * @returns True if an entity was deleted, false otherwise.
   */
  async delete(filter: FilterQuery<T>): Promise<boolean> {
    const result = await this.model.deleteOne(filter).exec();
    return result.deletedCount !== undefined && result.deletedCount > 0;
  }
}
