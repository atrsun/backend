import {
  Injectable,
  ForbiddenException,
  UnprocessableEntityException,
  NotFoundException,
} from '@nestjs/common';

import { HolooPreInvoiceApis } from '../../modules/holoo/apis/holoo.pre-invoice';
import { UserService } from '../../modules/user/user.service';
import { UserEntity } from 'modules/user/user.entity';
import { CreatePreInvoiceDto } from 'modules/holoo/dtos/create-pre-invoice.dto';
import { PreInvoiceRepository } from './pre-invoice.repository';
import type { PreInvoiceEntity } from './pre-invoice.entity';
import type { FilterQuery } from 'mongoose';

@Injectable()
export class PreInvoiceService {
  constructor(
    private userService: UserService,
    private holooPreInvoice: HolooPreInvoiceApis,
    private preInvoiceRepo: PreInvoiceRepository,
  ) {}

  async addPreInvoice(
    vaset: UserEntity,
    createPreInvoiceDto: CreatePreInvoiceDto,
  ) {
    const { costumerErpCode, discountPercent, productInfo } =
      createPreInvoiceDto;

    const vasetCanAddPreInvoice = await this.isValidVaset(
      vaset,
      costumerErpCode,
    );

    if (!vasetCanAddPreInvoice.result) {
      throw new ForbiddenException(
        'seller cant add pre invoice for this customer',
      );
    }

    const preInvoice = await this.holooPreInvoice.addNewPreInvoice(
      productInfo,
      costumerErpCode,
      discountPercent,
    );
    let Code: string;
    let ErpCode: string;

    if (preInvoice?.invoiceResponse?.Success?.ErpCode) {
      Code = preInvoice?.invoiceResponse?.Success.Code;
      ErpCode = preInvoice?.invoiceResponse?.Success.ErpCode;

      const { invoiceinfo } = preInvoice.savedData;

      const { detailinfo, ...restFields } = invoiceinfo;

      let totalPrice = 0;
      let discountPrice = 0;
      const details = detailinfo.map((item) => {
        totalPrice += item.SumPrice;
        discountPrice += (item.SumPrice * item.discountpercent) / 100

        return {
          Price: item.price,
          ProductErpCode: item.ProductErpCode,
          Few: item.few,
          SumPrice: item.SumPrice,
          ProductName: item.ProductName,
          ProductCode: item.ProductCode,
          discountpercent: item.discountpercent,
          PersentDiscount: item.discountpercent,
        };
      });
console.log('details', details);
      const newInvoice = await this.preInvoiceRepo.create({
        ...restFields,
        Detail: details as any,
        VasetErpCode: vaset.ErpCode,
        CustomerName: vasetCanAddPreInvoice.user?.Name,
        Date: restFields.date,
        Time: restFields.time,
        CustomerErpCode: restFields.customererpcode,
        // SumDiscount: restFields.Discount,
        SumDiscount:discountPrice,
        SumLevy: restFields.levy,
        SumScot: restFields.scot,
        TypeName: 'فروش',
        totalPrice,
        isConverted: false,
        Code,
        ErpCode,
      });

      return newInvoice.toDto();
    }

    throw new UnprocessableEntityException(
      preInvoice?.invoiceResponse?.Failure?.Error ||
        'Error happens from Holoo server please try again',
    );
  }

  async isValidVaset(
    vaset: UserEntity,
    userErpCodes: string,
  ): Promise<{ result: boolean; user: UserEntity | null }> {
    const user = await this.userService.findOne({
      ErpCode: userErpCodes,
      'Vaseteh.ErpCode': vaset?.ErpCode,
    });

    if (user) {
      return { result: true, user };
    }

    return { result: false, user: null };
  }

  async getPreInvoices(vaset: UserEntity) {
    const invoices = await this.preInvoiceRepo.find({
      VasetErpCode: vaset.ErpCode,
      isConverted: false,
    });

    return this.transferToDto(invoices);
  }

  async getPreInvoice(_id: string) {
    const preInvoice = await this.preInvoiceRepo.findOne({
      _id,
    });

    if (!preInvoice) {
      throw new NotFoundException('preInvoice not founded');
    }

    return preInvoice.toDto();
  }

  async getAllPreInvoices() {
    const invoices = await this.preInvoiceRepo.find({});

    return this.transferToDto(invoices);
  }

  transferToDto(preInvoice: PreInvoiceEntity[]) {
    const normalizedPreInvoices = preInvoice.map((u) => u.toDto());

    return normalizedPreInvoices;
  }

  async findOne(filter: FilterQuery<PreInvoiceEntity>) {
    const preInvoice = await this.preInvoiceRepo.findOne(filter);

    if (!preInvoice) {
      return null;
    }

    return preInvoice!.toDto();
  }

  async update(
    filter: FilterQuery<PreInvoiceEntity>,
    updateDocument: Partial<PreInvoiceEntity>,
  ) {
    const preInvoice = await this.preInvoiceRepo.update(filter, updateDocument);
    return preInvoice!.toDto();
  }

  async deletePreInvoice(_id: string) {
    const preInvoice = this.findOne({ _id });

    if (!preInvoice) {
      throw new NotFoundException('pre invoice not founded');
    }

    await this.preInvoiceRepo.delete({ _id });

    return true;
  }
}
