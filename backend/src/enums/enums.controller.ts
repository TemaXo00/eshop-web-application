import { Controller, Get } from '@nestjs/common';
import {
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { Roles, Status, PaymentMethods, PaymentStatus } from '../../prisma/generated/prisma/enums';

@ApiTags('Enums')
@Controller('enums')
export class EnumsController {
  constructor() {}

  @ApiOperation({
    summary: 'Get user roles enum',
    description: 'Retrieve all available user roles',
  })
  @ApiOkResponse({
    description: 'Successfully retrieved user roles',
    schema: {
      example: ['USER', 'EMPLOYEE', 'ADMIN', 'SUPPLIERMANAGER'],
    },
  })
  @Get('roles')
  async getRolesEnum() {
    return Object.values(Roles);
  }

  @ApiOperation({
    summary: 'Get user statuses enum',
    description: 'Retrieve all available user statuses',
  })
  @ApiOkResponse({
    description: 'Successfully retrieved user statuses',
    schema: {
      example: ['ACTIVE', 'BANNED', 'DELETED'],
    },
  })
  @Get('statuses')
  async getStatusesEnum() {
    return Object.values(Status);
  }

  @ApiOperation({
    summary: 'Get payment methods enum',
    description: 'Retrieve all available payment methods',
  })
  @ApiOkResponse({
    description: 'Successfully retrieved payment methods',
    schema: {
      example: ['CARD', 'CASH'],
    },
  })
  @Get('payment-methods')
  async getPaymentMethodsEnum() {
    return Object.values(PaymentMethods);
  }

  @ApiOperation({
    summary: 'Get payment statuses enum',
    description: 'Retrieve all available payment statuses',
  })
  @ApiOkResponse({
    description: 'Successfully retrieved payment statuses',
    schema: {
      example: ['OK', 'DECLINED', 'REFUND'],
    },
  })
  @Get('payment-statuses')
  async getPaymentStatusesEnum() {
    return Object.values(PaymentStatus);
  }
}