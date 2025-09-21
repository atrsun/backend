import { Inject, Injectable } from '@nestjs/common';
import { HolooService } from '../holoo.service';

@Injectable()
export class HolooReportApis {
  constructor(
    @Inject(HolooService) protected readonly holooService: HolooService,
  ) {}

  async getAccountReport() {
    const data = await this.holooService.axios.get('/Report/GetAccound');

    return data.data;
  }

  async getCashReport() {
    const data = await this.holooService.axios.get('/Report/GetCash');

    return data.data;
  }

  async getCustomerPay() {
    const data = await this.holooService.axios.get('/Report/GetCustPay');

    return data.data;
  }

  async getCustomerReceive() {
    const data = await this.holooService.axios.get('/Report/GetCustReceive');

    return data.data;
  }

  async getKardexSarfasl() {
    const data = await this.holooService.axios.get('/Report/GetKardexSarfasl');

    return data.data;
  }

  async getMaxBedCustomer() {
    const data = await this.holooService.axios.get('/Report/GetMaxBedCustomer');

    return data.data;
  }

  async getMaxBestCustomer() {
    const data = await this.holooService.axios.get('/Report/GetMaxBesCustomer');

    return data.data;
  }

  async getMaxFewProduct() {
    const data = await this.holooService.axios.get('/Report/GetMaxFewProduct');

    return data.data;
  }

  async getMaxSellFewProduct() {
    const data = await this.holooService.axios.get(
      '/Report/GetMaxSelFewProduct',
    );

    return data.data;
  }

  async getMaxSellPriceProduct() {
    const data = await this.holooService.axios.get(
      '/Report/GetMaxSelPriceProduct',
    );

    return data.data;
  }

  async getMinFewProduct() {
    const data = await this.holooService.axios.get('/Report/GetMinFewProduct');

    return data.data;
  }

  async getMinSellFewProduct() {
    const data = await this.holooService.axios.get(
      '/Report/GetMinSelFewProduct',
    );

    return data.data;
  }

  async getMinSellPriceProduct() {
    const data = await this.holooService.axios.get(
      '/Report/GetMinSelPriceProduct',
    );

    return data.data;
  }

  async getSarfasl() {
    const data = await this.holooService.axios.get('/Report/GetSarfasl');

    return data.data;
  }

  async getMoienReport() {
    const data = await this.holooService.axios.get('/Report/moien-report');

    return data.data;
  }
}
