import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { InvoiceService } from './invoice.service';
import { CreateInvoiceDto } from './dtos/create-invoice.dto';
import { Auth } from '../../decorators/http.decorators';
import { RoleType } from '../../constants/role-type';
import { ApiOkResponse, ApiParam } from '@nestjs/swagger';
import { InvoiceDto } from './dtos/invoice.dto';
import { AuthUser } from '../../decorators/auth-user.decorator';
import { UserEntity } from '../../modules/user/user.entity';

@Controller('invoice')
export class InvoiceController {
  constructor(private readonly invoiceService: InvoiceService) {}

  @Post()
  @Auth([RoleType.ADMIN, RoleType.USER])
  @ApiOkResponse({
    type: [InvoiceDto],
    description: 'get current seller all users that are is vaset of them',
  })
  async createInvoice(@Body() createInvoiceDto: CreateInvoiceDto) {
    return await this.invoiceService.createInvoice(createInvoiceDto);
  }

  @Get()
  @Auth([RoleType.ADMIN, RoleType.USER])
  @ApiOkResponse({
    type: [InvoiceDto],
    description: 'get current seller all users that are is vaset of them',
  })
  async getInvoices(@AuthUser() vaset: UserEntity) {
    return await this.invoiceService.getInvoices(vaset);
  }

  @Get(':_id')
  @Auth([RoleType.ADMIN, RoleType.USER])
  @ApiOkResponse({
    type: InvoiceDto,
    description: 'get current seller all users that are is vaset of them',
  })
  @ApiParam({
    required: true,
    name: "_id",
    description: "_id of invoice"
  })
  async getInvoice(@Param() _id: string) {
    return await this.invoiceService.getInvoice(_id);
  }
}
