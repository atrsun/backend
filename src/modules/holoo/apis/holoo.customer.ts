import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
  UnprocessableEntityException,
} from '@nestjs/common';
import { HolooService } from '../holoo.service';
import { UserEntity } from 'modules/user/user.entity';
import type { HolooDocumentCount } from '../types/holoo-document-count.type';
import type { HolooCustomer } from '../types/holoo-customer.type';
import type { HolooCustomerAddress } from '../types/holoo-customer-address.type';
import type { HolooAddCustomer } from '../types/holoo-add-customer.type';
import { FilterCustomerDto } from '../dtos/filter-customer.dto';
import { PaginationDto } from 'common/dto/paginate.dto';
@Injectable()
export class HolooCustomerApis {
  constructor(
    @Inject(HolooService) protected readonly holooService: HolooService,
  ) {}

  async getCustomers(paginationDto: PaginationDto): Promise<HolooCustomer> {
    const { page, limit } = paginationDto;

    const data = await this.holooService.axios.get(
      `/Customer/${page}/${limit}`,
    );

    return data.data;
  }

  async filterCustomer(
    filterCustomerDto: FilterCustomerDto,
  ): Promise<HolooCustomer> {
    const { phone, name } = filterCustomerDto;

    if (!phone && !name) {
      throw new BadRequestException('phone or name should provided');
    }

    let Abstractfilter = `?`;

    if (phone) {
      Abstractfilter += `Mobile=${phone}`;
    }

    if (name) {
      Abstractfilter.length > 2
        ? (Abstractfilter += `&name=${name}`)
        : (Abstractfilter += `name=${name}`);
    }

    const url = `/Customer${Abstractfilter}`;

    const data = await this.holooService.axios.get(url);

    return data.data;
  }

  async getCustomerByErpCode(erpCode: string): Promise<HolooCustomer> {
    const url = `/Customer?ErpCode=${erpCode}`;
    const data = await this.holooService.axios.get(url);
    return data.data;
  }

  async getCustomersCount(): Promise<HolooDocumentCount> {
    const data = await this.holooService.axios.get('/Customer/count');

    return data.data;
  }

  async getCustomersAddress(
    customerErpCode: string,
  ): Promise<HolooCustomerAddress> {
    const data = await this.holooService.axios.get(
      `/Customer/address?customerErpCode=${customerErpCode}`,
    );

    return data.data;
  }

  async addNewCustomer(user: UserEntity): Promise<HolooAddCustomer> {
    const headers = {
      accept: 'application/json',
      // Authorization: '1', // Token or key for authorization
      'Content-Type': 'application/json',
    };

    const bodyData = {
      custinfo: {
        id: '11234',
        name: `${user.Name}`,
        ispurchaser: true,
        isseller: true,
        custtype: 1,
        mobile: user.Mobile,
      },
    };
    const data = await this.holooService.axios.post(
      '/Customer',
      JSON.stringify(bodyData),
      { headers },
    );
    return data.data;
  }

  async removeCustomer(erpCode: string): Promise<Record<string, any>> {
    const data = await this.holooService.axios.delete('/Customer', {
      params: { erpCode },
    });

    return data.data;
  }

  async getCustomerErpCode(user: UserEntity): Promise<string> {
    const isUserExist = await this.filterCustomer({ phone: user.Mobile });

    if (Object.keys(isUserExist).length !== 0) {
      return isUserExist.Customer[0].ErpCode;
    }

    try {
      const newCustomer = await this.addNewCustomer(user);

      return newCustomer.Success.ErpCode;
    } catch (error) {
      Logger.debug(
        `Error on adding new customer to holoo : userid: ${user.id}, error: ${error}`,
      );
      throw new UnprocessableEntityException(
        'server cant add user to holoo right now. please try again later',
      );
    }
  }

  async getSellers(): Promise<HolooCustomer> {
    const data = await this.holooService.axios.get(`Customer?IsVaseteh=true`);

    return data.data;
  }
}
