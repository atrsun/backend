import {
  BadRequestException,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Query,
} from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { HolooProductsApis } from './apis/holoo.product';
import { GetProductQuery } from './dtos/get-product-query.dto';
import { HolooProductDto } from './dtos/holoo-product.dto';
import { HolooCustomerApis } from './apis/holoo.customer';
import { HolooCustomerDto } from './dtos/holoo-customer.dto';
import { FilterCustomerDto } from './dtos/filter-customer.dto';
import { PaginationDto } from '../../common/dto/paginate.dto';
import { GetCustomersAddressDto } from './dtos/get-costumer-address.dto';

@Controller('holoo')
@ApiTags('holoo')
export class HolooController {
  constructor(
    private readonly productApiService: HolooProductsApis,
    private readonly costumerService: HolooCustomerApis,
  ) {}

  @Get('product')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    type: HolooProductDto,
    description:
      'get product  \n note: at least one of this parameters should send: {name: string, code: string,erpcode: string}',
  })
  async getProduct(@Query() query: GetProductQuery) {
    if (!query) {
      throw new BadRequestException(
        'for getting product at least one parameter needed',
      );
    }

    return await this.productApiService.searchProduct(query);
  }

  @Get('products')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    type: HolooProductDto,
    description: 'get products list',
  })
  async getProducts(@Query() paginationDto: PaginationDto) {
    return await this.productApiService.getProductList(paginationDto);
  }

  @Get('filterCustomer')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    type: HolooCustomerDto,
    description: 'filter Customers',
  })
  async filterCustomer(@Query() filterCustomerDto: FilterCustomerDto) {
    return await this.costumerService.filterCustomer(filterCustomerDto);
  }

  @Get('Customer')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    type: HolooCustomerDto,
    description: 'get customers by pagination. default is page 1 and limit 50',
  })
  async getCustomers(@Query() paginationDto: PaginationDto) {
    return await this.costumerService.getCustomers(paginationDto);
  }

  @Get('costumerAddress')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    description: 'get addresses',
  })
  async getCostumerAddress(
    @Query() getCustomersAddressDto: GetCustomersAddressDto,
  ) {
    const { customerErpCode } = getCustomersAddressDto;

    if (!customerErpCode) {
      throw new BadRequestException(
        'customer erpcode is required to get user addresses',
      );
    }

    return await this.costumerService.getCustomersAddress(customerErpCode);
  }

  @Get('sellers')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    description: 'get verified sellers in system',
  })
  async getSellers() {
    return await this.costumerService.getSellers();
  }
}
