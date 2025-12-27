import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { SaleService } from './sale.service';
import { PaginationDto } from '../common/dto/pagination.dto';
import {
  ApiTags,
  ApiOperation,
  ApiQuery,
  ApiOkResponse,
  ApiBadRequestResponse,
  ApiUnauthorizedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
} from '@nestjs/swagger';
import { CreateSaleDto } from './dto/create-sale.dto';
import { UpdateSaleDto } from './dto/update-sale.dto';
import { SaleResponseDto } from './dto/sale-response.dto';
import { PaginatedResponseDto } from '../common/dto/pagination.dto';
import { Authorized } from '../common/decorators/authorized.decorator';
import * as client from '../../prisma/generated/prisma/client';
import { Roles } from '../common/decorators/roles.decorator';
import { Authorization } from '../common/decorators/authorization.decorator';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles as UserRoles } from '../../prisma/generated/prisma/client';
import { JwtSwagger } from '../common/decorators/jwt-swagger.decorator';

@Controller('sales')
@ApiTags('Sales')
export class SaleController {
  constructor(private readonly saleService: SaleService) {}

  @ApiOperation({ summary: 'Get paginated sales with optional filters' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({
    name: 'storeId',
    required: false,
    type: Number,
  })
  @ApiQuery({
    name: 'clientId',
    required: false,
    type: Number,
  })
  @ApiQuery({
    name: 'sellerId',
    required: false,
    type: Number,
  })
  @ApiQuery({
    name: 'startDate',
    required: false,
    type: String,
  })
  @ApiQuery({
    name: 'endDate',
    required: false,
    type: String,
  })
  @ApiOkResponse({
    description: 'Returns paginated sales',
    type: PaginatedResponseDto,
  })
  @ApiBadRequestResponse({ description: 'Bad request' })
  @JwtSwagger()
  @UseGuards(RolesGuard)
  @Authorization()
  @Roles(UserRoles.ADMIN, UserRoles.EMPLOYEE)
  @Get()
  async getAll(
      @Authorized() user: client.User,
      @Query() dto: PaginationDto,
      @Query('storeId') storeId?: string,
      @Query('clientId') clientId?: string,
      @Query('sellerId') sellerId?: string,
      @Query('startDate') startDate?: string,
      @Query('endDate') endDate?: string,
  ) {
    return await this.saleService.getAllSales(
        dto,
        user.id,
        user.role,
        {
          storeId: storeId ? parseInt(storeId) : undefined,
          clientId: clientId ? parseInt(clientId) : undefined,
          sellerId: sellerId ? parseInt(sellerId) : undefined,
          startDate,
          endDate,
        }
    );
  }

  @ApiOperation({ summary: 'Get sale by id' })
  @ApiOkResponse({
    description: 'Returns sale by id',
    type: SaleResponseDto,
  })
  @ApiNotFoundResponse({ description: 'Sale not found' })
  @JwtSwagger()
  @UseGuards(RolesGuard)
  @Authorization()
  @Roles(UserRoles.ADMIN, UserRoles.EMPLOYEE)
  @Get(':id')
  async getOne(
      @Authorized() user: client.User,
      @Param('id', ParseIntPipe) id: number,
  ) {
    return await this.saleService.getSaleById(id, user.id, user.role);
  }

  @ApiOperation({ summary: 'Create new sale' })
  @ApiOkResponse({
    description: 'Created successfully',
    type: SaleResponseDto,
  })
  @ApiBadRequestResponse({ description: 'Invalid fields' })
  @ApiUnauthorizedResponse({ description: 'User unauthorized' })
  @ApiForbiddenResponse({ description: 'Insufficient permissions' })
  @JwtSwagger()
  @UseGuards(RolesGuard)
  @Authorization()
  @Roles(UserRoles.EMPLOYEE)
  @Post()
  async create(
      @Authorized() user: client.User,
      @Body() data: CreateSaleDto,
  ) {
    return await this.saleService.createSale(data, user.id);
  }

  @ApiOperation({ summary: 'Update sale payment status' })
  @ApiOkResponse({
    description: 'Updated successfully',
    type: SaleResponseDto,
  })
  @ApiBadRequestResponse({ description: 'Invalid data' })
  @ApiNotFoundResponse({ description: 'Sale with id not found' })
  @ApiUnauthorizedResponse({ description: 'User unauthorized' })
  @ApiForbiddenResponse({ description: 'Insufficient permissions' })
  @JwtSwagger()
  @UseGuards(RolesGuard)
  @Authorization()
  @Roles(UserRoles.ADMIN, UserRoles.EMPLOYEE)
  @Put(':id')
  async update(
      @Authorized() user: client.User,
      @Param('id', ParseIntPipe) id: number,
      @Body() dto: UpdateSaleDto,
  ) {
    return await this.saleService.updateSale(id, dto, user.id, user.role);
  }
}