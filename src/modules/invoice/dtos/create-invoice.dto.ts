import { StringField } from '../../../decorators/field.decorators';

export class CreateInvoiceDto {
  @StringField({
    example: '6811002fbe4a0d6be9e13776',
    description: '_id of preInvoice',
  })
  preInvoiceId!: string;
}
