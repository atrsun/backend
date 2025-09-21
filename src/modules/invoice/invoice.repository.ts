import { InjectModel } from '@nestjs/mongoose';
import { AbstractRepository } from '../../common/abstract.repository';
import { Injectable } from '@nestjs/common';
import type { Model } from 'mongoose';
import { InvoiceEntity } from './invoice.entity';

@Injectable()
export class InvoiceRepository extends AbstractRepository<InvoiceEntity> {
  constructor(
    @InjectModel(InvoiceEntity.name)
    protected readonly invoiceRepo: Model<InvoiceEntity>,
  ) {
    super(invoiceRepo);
  }
}
