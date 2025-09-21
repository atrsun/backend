import { Module } from '@nestjs/common';
import { PreInvoiceService } from './pre-invoice.service';
import { PreInvoiceController } from './pre-invoice.controller';
import { UserModule } from '../../modules/user/user.module';
import { HolooModule } from '../../modules/holoo/holoo.module';
import { MongooseModule } from '@nestjs/mongoose';
import { PreInvoiceEntity, PreInvoiceEntitySchema } from './pre-invoice.entity';
import { PreInvoiceRepository } from './pre-invoice.repository';

@Module({
  imports: [
    UserModule,
    HolooModule,
    MongooseModule.forFeature([
      { name: PreInvoiceEntity.name, schema: PreInvoiceEntitySchema },
    ]),
  ],
  providers: [PreInvoiceService, PreInvoiceRepository],
  controllers: [PreInvoiceController],
  exports: [PreInvoiceService],
})
export class PreInvoiceModule {}
