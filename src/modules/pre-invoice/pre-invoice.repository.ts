import { InjectModel } from '@nestjs/mongoose';
import { AbstractRepository } from '../../common/abstract.repository';
import { Injectable } from '@nestjs/common';
import type { Model } from 'mongoose';
import { PreInvoiceEntity } from './pre-invoice.entity';

@Injectable()
export class PreInvoiceRepository extends AbstractRepository<PreInvoiceEntity> {
  constructor(
    @InjectModel(PreInvoiceEntity.name)
    protected readonly preInvoiceRepo: Model<PreInvoiceEntity>,
  ) {
    super(preInvoiceRepo);
  }
}
