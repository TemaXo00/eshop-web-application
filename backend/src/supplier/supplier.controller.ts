import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { SupplierService } from './supplier.service';
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
  ApiConflictResponse,
} from '@nestjs/swagger';
import { CreateSupplierDto } from './dto/create-supplier.dto';
import { UpdateSupplierDto } from './dto/update-supplier.dto';
import { SupplierResponseDto } from './dto/supplier-response.dto';
import { PaginatedResponseDto } from '../common/dto/pagination.dto';
import { Authorized } from '../common/decorators/authorized.decorator';
import * as client from '../../prisma/generated/prisma/client';
import { Roles } from '../common/decorators/roles.decorator';
import { Authorization } from '../common/decorators/authorization.decorator';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles as UserRoles } from '../../prisma/generated/prisma/client';
import { JwtSwagger } from '../common/decorators/jwt-swagger.decorator';

@Controller('suppliers')
@ApiTags('Suppliers')
export class SupplierController {
  constructor(private readonly supplierService: SupplierService) {}

  @ApiOperation({ summary: 'Get paginated suppliers with optional search' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({
    name: 'search',
    required: false,
    type: String,
    description: 'Search by name, phone or email',
  })
  @ApiOkResponse({
    description: 'Returns paginated suppliers',
    type: PaginatedResponseDto,
  })
  @ApiBadRequestResponse({ description: 'Bad request' })
  @Get()
  async getAll(@Query() dto: PaginationDto, @Query('search') search?: string) {
    return await this.supplierService.getAllSuppliers(dto, search);
  }

  @ApiOperation({ summary: 'Get supplier by id' })
  @ApiOkResponse({
    description: 'Returns supplier by id',
    type: SupplierResponseDto,
  })
  @ApiNotFoundResponse({ description: 'Supplier not found' })
  @Get(':id')
  async getOne(@Param('id', ParseIntPipe) id: number) {
    return await this.supplierService.getSupplierById(id);
  }

  @ApiOperation({ summary: 'Create new supplier' })
  @ApiOkResponse({
    description: 'Created successfully',
    type: SupplierResponseDto,
  })
  @ApiBadRequestResponse({ description: 'Invalid fields' })
  @ApiUnauthorizedResponse({ description: 'User unauthorized' })
  @ApiForbiddenResponse({ description: 'Insufficient permissions' })
  @ApiConflictResponse({ description: 'Supplier already exists' })
  @JwtSwagger()
  @UseGuards(RolesGuard)
  @Authorization()
  @Roles(UserRoles.ADMIN, UserRoles.SUPPLIERMANAGER)
  @Post()
  async create(
    @Authorized() user: client.User,
    @Body() data: CreateSupplierDto,
  ) {
    return await this.supplierService.createSupplier(data, user.id);
  }

  @ApiOperation({ summary: 'Update supplier by ID' })
  @ApiOkResponse({
    description: 'Updated successfully',
    type: SupplierResponseDto,
  })
  @ApiBadRequestResponse({ description: 'Invalid data' })
  @ApiNotFoundResponse({ description: 'Supplier with id not found' })
  @ApiUnauthorizedResponse({ description: 'User unauthorized' })
  @ApiForbiddenResponse({ description: 'Insufficient permissions' })
  @ApiConflictResponse({
    description: 'Supplier with unique field already exists',
  })
  @JwtSwagger()
  @UseGuards(RolesGuard)
  @Authorization()
  @Roles(UserRoles.ADMIN, UserRoles.SUPPLIERMANAGER)
  @Put(':id')
  async update(
    @Authorized() user: client.User,
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateSupplierDto,
  ) {
    return await this.supplierService.updateSupplier(id, dto, user.id);
  }

  @ApiOperation({ summary: 'Delete supplier by ID' })
  @ApiOkResponse({ description: 'Deleted successfully' })
  @ApiNotFoundResponse({ description: 'Supplier with id not found' })
  @ApiUnauthorizedResponse({ description: 'User unauthorized' })
  @ApiForbiddenResponse({ description: 'Insufficient permissions' })
  @JwtSwagger()
  @UseGuards(RolesGuard)
  @Authorization()
  @Roles(UserRoles.ADMIN)
  @Delete(':id')
  async delete(
    @Authorized() user: client.User,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return await this.supplierService.removeSupplier(id);
  }
}
