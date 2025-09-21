import { forwardRef, Inject, NotFoundException } from '@nestjs/common';
import { HolooService } from '../holoo.service';
import type { IBuyProductInfo } from 'interfaces/holoo-buy-product-interface';
import type { HolooCreateInvoice } from '../types/holoo-create-pre-invoice-output.type';
import { HolooCustomerApis } from './holoo.customer';

export class HolooInvoiceApis {
  constructor(
    @Inject(forwardRef(() => HolooService))
    protected readonly holooService: HolooService,
    @Inject(HolooCustomerApis)
    protected readonly holooCustomerApis: HolooCustomerApis,
  ) {}

  async addNewInvoice(
    addNewInvoiceInput: IBuyProductInfo[],
    customererpcode: string,
    Discount: number = 0,
  ): Promise<{ invoiceResponse: HolooCreateInvoice; currentInvoice: any }> {
    const { date, time, numberTime } = this.holooService.getCurrentTime;
    const id = String(numberTime);

    const productInfos = [];
    let totalPrice = 0;

    for (const item of addNewInvoiceInput) {
      productInfos.push({ ...item });
      totalPrice += item.price * item.quantity;
    }

    const finalDetailInfo: {
      id?: string;
      ProductErpCode: string;
      few: number;
      price: number;
      levy: number;
      scot: number;
    }[] = [];

    productInfos.map((i) =>
      finalDetailInfo.push({
        few: i.quantity,
        price: i.price,
        ProductErpCode: i.product_variant_erpcode,
        levy: 0,
        scot: 0,
      }),
    );

    const bodyData = {
      invoiceinfo: [
        {
          id,
          Type: '1', // Type = sell
          customererpcode, // replace with evasence erpcode
          date,
          time,
          Bank: Discount > 0 ? totalPrice - Discount : totalPrice,
          BankSarfasl: '10200010033',
          Nesiyeh: 0,
          Discount,
          detailinfo: finalDetailInfo,
        },
      ],
    };

    let isUserExist = null;
    try {
      isUserExist =
        await this.holooCustomerApis.getCustomerByErpCode(customererpcode);
    } catch (error) {}

    if (isUserExist) {
      let mandeh = isUserExist?.Customer[0]?.Mandeh || 0;
      let credit = isUserExist?.Customer[0]?.Credit || 0;
      const totalPriceInner = Discount > 0 ? totalPrice - Discount : totalPrice;

      const userCurrentCredit = credit - mandeh;

      if (totalPriceInner > userCurrentCredit) {
        throw new NotFoundException('customer have no required credit');
      }
    } else {
      throw new NotFoundException('customer not founded');
    }

    const data = await this.holooService.axios.post(
      `/Invoice/Invoice`,
      JSON.stringify(bodyData),
    );

    const invoiceResponse = data.data;
    let currentInvoice = null;

    if (invoiceResponse?.Success) {
      const erpCode = invoiceResponse?.Success?.ErpCode;
      if (erpCode) {
        currentInvoice = await this.getInvoiceInfo(erpCode);
      }
    }
    return { invoiceResponse, currentInvoice };
  }

  async getInvoiceInfo(erp_code: string) {
    const data = await this.holooService.axios.get(
      `/Invoice/Invoice?erpcode=${erp_code}`,
    );

    return data.data;
  }
}
