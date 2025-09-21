import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { InvoiceEntity, InvoiceEntitySchema } from './invoice.entity';
import { InvoiceService } from './invoice.service';
import { InvoiceRepository } from './invoice.repository';
import { InvoiceController } from './invoice.controller';
import { HolooModule } from '../../modules/holoo/holoo.module';
import { PreInvoiceModule } from '../../modules/pre-invoice/pre-invoice.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: InvoiceEntity.name, schema: InvoiceEntitySchema },
    ]),
    HolooModule,
    PreInvoiceModule,
  ],
  providers: [InvoiceService, InvoiceRepository],
  controllers: [InvoiceController],
})
export class InvoiceModule {}
