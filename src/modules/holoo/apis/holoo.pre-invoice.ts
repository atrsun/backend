import { Inject, UnprocessableEntityException } from '@nestjs/common';
import { HolooService } from '../holoo.service';
import type { IBuyProductInfo } from 'interfaces/holoo-buy-product-interface';
import type { HolooCreateInvoice } from '../types/holoo-create-pre-invoice-output.type';

export class HolooPreInvoiceApis {
  constructor(
    @Inject(HolooService)
    protected readonly holooService: HolooService,
  ) {}

  async addNewPreInvoice(
    addNewInvoiceInput: IBuyProductInfo[],
    customererpcode: string,
    discountPercent: number,
  ): Promise<{
    invoiceResponse: HolooCreateInvoice;
    savedData: PreInvoiceBodyData;
  }> {
    const { date, time, numberTime } = this.holooService.getCurrentTime;
    const id = String(numberTime);

    const productInfos = [];
    let totalPrice = 0;

    for (const item of addNewInvoiceInput) {
      productInfos.push({ ...item });
    }

    const finalDetailInfo: {
      ProductErpCode: string;
      few: number;
      price: number;
      SumPrice: number;
      discountpercent: number;
      ProductName: string;
      ProductCode: string;
    }[] = [];

    productInfos.map((i) => {
      const sumPrice = i.price * i.quantity;
      totalPrice += sumPrice;
      finalDetailInfo.push({
        few: i.quantity,
        price: i.price,
        ProductErpCode: i.product_variant_erpcode,
        SumPrice: sumPrice,
        discountpercent: i.discount_percent?i.discount_percent:0,
        ProductName: i.productName,
        ProductCode: i.productCode,
      });
    });

    const bodyData = {
      invoiceinfo: {
        id,
        Type: '1',
        date,
        time,
        levy: 0,
        scot: 0,
        Discount: discountPercent || 0,
        customererpcode,
        detailinfo: finalDetailInfo,
      },
    };
// console.log('`bodybbbb`', JSON.stringify(bodyData));
const data = await this.holooService.axios.post(
    '/Invoice/PreInvoice',
    JSON.stringify(bodyData),
);

    const invoiceResponse: HolooCreateInvoice = data.data;

    if (invoiceResponse.Success) {
      return { invoiceResponse, savedData: bodyData };
    }

    throw new UnprocessableEntityException(invoiceResponse?.Failure?.Error);
  }
}

export type PreInvoiceBodyData = {
  invoiceinfo: {
    id: string;
    customererpcode: string;
    Type: string;
    date: string;
    time: string;
    Discount: number;
    levy: number;
    scot: number;
    detailinfo: {
      id?: string;
      ProductErpCode: string;
      few: number;
      price: number;
      discountpercent: number;
      SumPrice: number;
      ProductName: string;
      ProductCode: string;
    }[];
  };
};
