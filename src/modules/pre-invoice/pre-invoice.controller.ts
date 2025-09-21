import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
} from '@nestjs/common';
import { PreInvoiceService } from './pre-invoice.service';
import { CreatePreInvoiceDto } from '../../modules/holoo/dtos/create-pre-invoice.dto';
import { AuthUser } from '../../decorators/auth-user.decorator';
import { UserEntity } from '../../modules/user/user.entity';
import { Auth } from '../../decorators/http.decorators';
import { RoleType } from '../../constants/role-type';
import { ApiParam } from '@nestjs/swagger';

@Controller('pre-invoice')
export class PreInvoiceController {
  constructor(private preInvoiceService: PreInvoiceService) {}

  @Post('preInvoice')
  @Auth([RoleType.ADMIN, RoleType.USER])
  @HttpCode(HttpStatus.CREATED)
  async addPreInvoice(
    @AuthUser() vaset: UserEntity,
    @Body() createPreInvoiceDto: CreatePreInvoiceDto,
  ) {
    console.log('createPreInvoiceDto', createPreInvoiceDto)
    return await this.preInvoiceService.addPreInvoice(
      vaset,
      createPreInvoiceDto,
    );
  }

  @Get('preInvoice')
  @Auth([RoleType.ADMIN, RoleType.USER])
  @HttpCode(HttpStatus.CREATED)
  async getPreInvoices(@AuthUser() vaset: UserEntity) {
    return await this.preInvoiceService.getPreInvoices(vaset);
  }

  @Get('preInvoice/:_id')
  @Auth([RoleType.ADMIN, RoleType.USER])
  @HttpCode(HttpStatus.CREATED)
  @ApiParam({
    name: '_id',
    description: '_id of preInvoice',
    required: true,
  })
  async getPreInvoice(@Param() _id: string) {
    return await this.preInvoiceService.getPreInvoice(_id);
  }

  @Delete('preInvoice/:_id')
  @Auth([RoleType.ADMIN, RoleType.USER])
  @HttpCode(HttpStatus.CREATED)
  @ApiParam({
    name: '_id',
    description: '_id of preInvoice',
    required: true,
  })
  async deletePreInvoice(@Param() _id: string) {
    return await this.preInvoiceService.deletePreInvoice(_id);
  }

  @Get('preInvoice-admin')
  @Auth([RoleType.ADMIN])
  @HttpCode(HttpStatus.CREATED)
  async getAllPreInvoices(@AuthUser() vaset: UserEntity) {
    return await this.preInvoiceService.getPreInvoices(vaset);
  }
}
