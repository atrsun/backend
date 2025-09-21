import { Module } from '@nestjs/common';
import { AxiosModule } from '../../modules/axios/custom-axios.module';
import { HolooService } from './holoo.service';
import { HolooProductsApis } from './apis/holoo.product';
import { HolooCustomerApis } from './apis/holoo.customer';
import { HolooController } from './holoo.controller';
import { HolooPreInvoiceApis } from './apis/holoo.pre-invoice';
import { HolooInvoiceApis } from './apis/holoo.invoice';

const providers = [
  HolooProductsApis,
  HolooCustomerApis,
  HolooPreInvoiceApis,
  HolooInvoiceApis,
];
@Module({
  imports: [
    AxiosModule.register({
      baseURL: 'http://185.186.50.228:8080/TncHoloo/api',
      timeout: 15_000,
    }),
  ],
  providers: [...providers, HolooService],
  controllers: [HolooController],
  exports: [...providers],
})
export class HolooModule {}
