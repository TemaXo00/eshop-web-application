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
import { ProductService } from './product.service';
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
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductResponseDto } from './dto/product-response.dto';
import { PaginatedResponseDto } from '../common/dto/pagination.dto';
import { Authorized } from '../common/decorators/authorized.decorator';
import * as client from '../../prisma/generated/prisma/client';
import { Roles } from '../common/decorators/roles.decorator';
import { Authorization } from '../common/decorators/authorization.decorator';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles as UserRoles } from '../../prisma/generated/prisma/client';
import { JwtSwagger } from '../common/decorators/jwt-swagger.decorator';

@Controller('products')
@ApiTags('Products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @ApiOperation({ summary: 'Get paginated products with optional search' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({
    name: 'search',
    required: false,
    type: String,
    description: 'Search by name or description',
  })
  @ApiOkResponse({
    description: 'Returns paginated products',
    type: PaginatedResponseDto,
  })
  @ApiBadRequestResponse({ description: 'Bad request' })
  @Get()
  async getAll(@Query() dto: PaginationDto, @Query('search') search?: string) {
    return await this.productService.getAllProducts(dto, search);
  }

  @ApiOperation({ summary: 'Get product by id' })
  @ApiOkResponse({
    description: 'Returns product by id',
    type: ProductResponseDto,
  })
  @ApiNotFoundResponse({ description: 'Product not found' })
  @Get(':id')
  async getOne(@Param('id', ParseIntPipe) id: number) {
    return await this.productService.getProductById(id);
  }

  @ApiOperation({ summary: 'Create new product' })
  @ApiOkResponse({
    description: 'Created successfully',
    type: ProductResponseDto,
  })
  @ApiBadRequestResponse({ description: 'Invalid fields' })
  @ApiUnauthorizedResponse({ description: 'User unauthorized' })
  @ApiForbiddenResponse({ description: 'Insufficient permissions' })
  @ApiConflictResponse({ description: 'Product already exists' })
  @JwtSwagger()
  @UseGuards(RolesGuard)
  @Authorization()
  @Roles(UserRoles.ADMIN)
  @Post()
  async create(
    @Authorized() user: client.User,
    @Body() data: CreateProductDto,
  ) {
    return await this.productService.createProduct(data);
  }

  @ApiOperation({ summary: 'Update product by ID' })
  @ApiOkResponse({
    description: 'Updated successfully',
    type: ProductResponseDto,
  })
  @ApiBadRequestResponse({ description: 'Invalid data' })
  @ApiNotFoundResponse({ description: 'Product with id not found' })
  @ApiUnauthorizedResponse({ description: 'User unauthorized' })
  @ApiForbiddenResponse({ description: 'Insufficient permissions' })
  @ApiConflictResponse({
    description: 'Product with name already exists',
  })
  @JwtSwagger()
  @UseGuards(RolesGuard)
  @Authorization()
  @Roles(UserRoles.ADMIN)
  @Put(':id')
  async update(
    @Authorized() user: client.User,
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateProductDto,
  ) {
    return await this.productService.updateProduct(id, dto);
  }

  @ApiOperation({ summary: 'Delete product by ID' })
  @ApiOkResponse({ description: 'Deleted successfully' })
  @ApiNotFoundResponse({ description: 'Product with id not found' })
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
    return await this.productService.removeProduct(id);
  }
}
