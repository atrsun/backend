import type {
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraintInterface,
} from 'class-validator';
import { registerDecorator, ValidatorConstraint } from 'class-validator';
import type { FilterQuery, Model } from 'mongoose';
import * as mongoose from 'mongoose';

/**
 * Custom validator to check for uniqueness of a value in a Mongoose model.
 *
 * Usage:
 *   @Unique([UserModel, (args: ValidationArguments) => ({ email: args.value })])
 *   email: string;
 */
@ValidatorConstraint({ name: 'unique', async: true })
export class UniqueValidator implements ValidatorConstraintInterface {
  async validate<E>(
    _value: string,
    args: IUniqueValidationArguments<E>,
  ): Promise<boolean> {
    const [modelOrName, findCondition] = args.constraints;
    let model: Model<E>;

    if (typeof modelOrName === 'string') {
      model = mongoose.models[modelOrName] as Model<E>;
      if (!model) {
        throw new Error(`Model with name "${modelOrName}" is not registered.`);
      }
    } else {
      model = modelOrName;
    }

    const filter: FilterQuery<E> = findCondition(args);
    const count = await model.countDocuments(filter);
    // Return true if no document exists with the same value.
    return count === 0;
  }

  defaultMessage(args: ValidationArguments): string {
    const [modelOrName] = args.constraints;
    const modelName =
      typeof modelOrName === 'string'
        ? modelOrName
        : modelOrName.modelName || 'Entity';
    return `${modelName} with the same ${args.property} already exists`;
  }
}

export type UniqueValidationConstraints<E> = [
  Model<E> | string,
  (validationArguments: ValidationArguments) => FilterQuery<E>,
];

interface IUniqueValidationArguments<E> extends ValidationArguments {
  constraints: UniqueValidationConstraints<E>;
}

/**
 * Decorator that checks for uniqueness of a property value in the specified Mongoose model.
 *
 * @param constraints - A tuple containing:
 *   - The Mongoose model (or model name) to check in.
 *   - A function that receives the validation arguments and returns a filter query.
 * @param validationOptions - Optional validator options.
 */
export function Unique<E>(
  constraints: UniqueValidationConstraints<E>,
  validationOptions?: ValidationOptions,
): PropertyDecorator {
  return (object, propertyName: string | symbol) => {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName as string,
      options: validationOptions,
      constraints,
      validator: UniqueValidator,
    });
  };
}
