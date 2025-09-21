import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { HolooService } from '../holoo.service';
import type { HolooProduct } from '../types/holoo-product.type';
import type { HolooSideGroup } from '../types/holoo-product-side-group.type';
import type { HolooMainGroup } from '../types/holoo-product-main-group.type';
import type { HolooDocumentCount } from '../types/holoo-document-count.type';
import type { HolooUpdateProduct } from '../types/holoo-update-product.type';
import { plainToClass } from 'class-transformer';
import { HolooProductDto } from '../dtos/holoo-product.dto';
import { PaginationDto } from 'common/dto/paginate.dto';

@Injectable()
export class HolooProductsApis {
  constructor(
    @Inject(HolooService) protected readonly holooService: HolooService,
  ) {}

  async getProductList(paginationDto: PaginationDto): Promise<HolooProduct> {
    const { limit, page } = paginationDto;

    const data = await this.holooService.axios.get(`/Product/${page}/${limit}`);

    return data.data;
  }

  async getProduct(code: string): Promise<HolooProduct> {
    const data = await this.holooService.axios.get(`/Product/?erpcode=${code}`);

    return data.data;
  }

  async searchProduct(args: {
    name?: string;
    code?: string;
    erpcode?: string;
  }): Promise<HolooProductDto> {
    const { code, name, erpcode } = args;

    if (erpcode) {
      try {
        const data = await this.getProduct(erpcode);
        return plainToClass(HolooProductDto, data);
      } catch (error) {
        throw new NotFoundException('product not founded');
      }
    }

    let urlQuery = '/Product/';
    const urlQueryBaseLength = urlQuery.length;

    if (name) {
      urlQuery += `?name=${name}`;
    }

    if (code) {
      urlQuery.length > urlQueryBaseLength
        ? (urlQuery += `&code=${code}`)
        : (urlQuery += `?code=${code}`);
    }

    try {
      const data = await this.holooService.axios.get(urlQuery);
      return plainToClass(HolooProductDto, data.data);
    } catch (error) {
      throw new NotFoundException('product not founded');
    }
  }

  async getProductMainGroup(): Promise<HolooMainGroup[]> {
    const data = await this.holooService.axios.get('/MainGroup');

    return data.data;
  }

  async getProductCount(): Promise<HolooDocumentCount> {
    const data = await this.holooService.axios.get('/Product/count');

    return data.data;
  }

  async getProductSideGroup(): Promise<HolooSideGroup[]> {
    const data = await this.holooService.axios.get('/SideGroup');

    return data.data;
  }

  async getProductUnit(): Promise<Record<string, any>> {
    const data = await this.holooService.axios.get('/Unit');

    return data.data;
  }

  async updateProduct(erp_code: string): Promise<HolooUpdateProduct> {
    const updateProductData = {
      productinfo: { erpcode: erp_code, countinkarton: 50 }, // few can be change by update mode
    };

    const data = await this.holooService.axios.put(
      '/Product',
      JSON.stringify(updateProductData),
    );

    return data.data;
  }
}
