import type {
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraintInterface,
} from 'class-validator';
import { registerDecorator, ValidatorConstraint } from 'class-validator';
import type { FilterQuery, Model } from 'mongoose';
import * as mongoose from 'mongoose';

/**
 * Custom validator to check for existence of a document in a Mongoose model.
 *
 * Usage:
 *   @Exists([UserModel, (args: ValidationArguments) => ({ _id: args.value })])
 *   userId: string;
 */
@ValidatorConstraint({ name: 'exists', async: true })
export class ExistsValidator implements ValidatorConstraintInterface {
  public async validate<E>(
    _value: string,
    args: IExistsValidationArguments<E>,
  ): Promise<boolean> {
    const [modelOrName, findCondition] = args.constraints;

    // Determine the Mongoose model instance.
    let model: Model<E>;
    if (typeof modelOrName === 'string') {
      // If a model name is provided, try to retrieve it from the default connection.
      model = mongoose.models[modelOrName] as Model<E>;
      if (!model) {
        throw new Error(`Model with name "${modelOrName}" is not registered.`);
      }
    } else {
      model = modelOrName;
    }

    // Build the filter query based on the provided function.
    const filter: FilterQuery<E> = findCondition(args);
    const count = await model.countDocuments(filter);
    return count > 0;
  }

  defaultMessage(args: ValidationArguments): string {
    // Use the model name if available, otherwise fallback.
    const [modelOrName] = args.constraints;
    const modelName =
      typeof modelOrName === 'string'
        ? modelOrName
        : modelOrName.modelName || 'Entity';

    return `The selected ${args.property} does not exist in ${modelName} entity.`;
  }
}

export type ExistsValidationConstraints<E> = [
  Model<E> | string,
  (validationArguments: ValidationArguments) => FilterQuery<E>,
];

interface IExistsValidationArguments<E> extends ValidationArguments {
  constraints: ExistsValidationConstraints<E>;
}

/**
 * Decorator that checks whether a given value exists in the specified Mongoose model.
 *
 * @param constraints - A tuple containing:
 *  - The Mongoose model (or model name) to check in.
 *  - A function that receives the validation arguments and returns a filter query.
 * @param validationOptions - Optional validator options.
 */
export function Exists<E>(
  constraints: ExistsValidationConstraints<E>,
  validationOptions?: ValidationOptions,
): PropertyDecorator {
  return (object, propertyName: string | symbol) => {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName as string,
      options: validationOptions,
      constraints,
      validator: ExistsValidator,
    });
  };
}
