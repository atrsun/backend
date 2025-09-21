import { HolooInvoiceApis } from './../holoo/apis/holoo.invoice';
import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InvoiceRepository } from './invoice.repository';
import { CreateInvoiceDto } from './dtos/create-invoice.dto';
import { PreInvoiceService } from '../../modules/pre-invoice/pre-invoice.service';
import type { IBuyProductInfo } from 'interfaces/holoo-buy-product-interface';
import type { UserEntity } from 'modules/user/user.entity';

@Injectable()
export class InvoiceService {
  constructor(
    private readonly invoiceRepository: InvoiceRepository,
    private readonly holooInvoiceApis: HolooInvoiceApis,
    private readonly preInvoiceService: PreInvoiceService,
  ) {}

  async createInvoice(createInvoiceDto: CreateInvoiceDto) {
    const { preInvoiceId } = createInvoiceDto;

    const preInvoice = await this.preInvoiceService.findOne({
      _id: preInvoiceId,
    });

    console.log('pre invoice is => ', preInvoice);

    if (!preInvoice) {
      throw new NotFoundException('PreInvoice not found');
    }

    const { CustomerErpCode, Detail, SumDiscount } = preInvoice;

    const invoiceData: IBuyProductInfo[] = [];

    Detail?.map((item) => {
      invoiceData.push({
        product_variant_erpcode: item.ProductErpCode,
        quantity: item.Few,
        price: item.Price,
        productName: item.ProductName,
        productCode: item.ProductCode,
      });
    });

    const addInvoiceToHoloo = await this.holooInvoiceApis.addNewInvoice(
      invoiceData,
      CustomerErpCode!,
      SumDiscount,
    );

    if (addInvoiceToHoloo?.invoiceResponse?.Success) {
      const { ErpCode, Code, SanadCode } =
        addInvoiceToHoloo.invoiceResponse.Success;

      const { _id, ...preInvoiceData } = preInvoice;

      console.log(preInvoiceData.VasetErpCode);

      const newInvoice = await this.invoiceRepository.create({
        ...preInvoiceData,
        ErpCode,
        Code: Number(Code),
        SanadCode: SanadCode as any,
        VasetErpCode: preInvoiceData.VasetErpCode,
      });

      this.preInvoiceService.update(
        { _id: preInvoiceId },
        { isConverted: true },
      );

      return newInvoice.toDto();
    }

    throw new UnprocessableEntityException(
      addInvoiceToHoloo?.invoiceResponse.Failure?.Error ||
        'خطا در ثبت پیش فاکتور',
    );
  }

  async getInvoices(vaset: UserEntity) {
    const allInvoices = await this.invoiceRepository.find({
      VasetErpCode: vaset.ErpCode,
    });

    const normalized = allInvoices.map((invoice) => invoice.toDto());

    return normalized;
  }

  async getInvoice(_id: string) {
    const invoice = await this.invoiceRepository.findOne({ _id });

    if (!invoice) {
      throw new NotFoundException('invoice not founded');
    }

    return invoice.toDto();
  }
}
