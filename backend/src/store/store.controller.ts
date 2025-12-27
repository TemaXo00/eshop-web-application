import {Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Query, UseGuards} from '@nestjs/common';
import { StoreService } from './store.service';
import {PaginationDto} from "../common/dto/pagination.dto";
import {ApiTags, ApiOperation, ApiQuery, ApiOkResponse, ApiBadRequestResponse, ApiUnauthorizedResponse, ApiForbiddenResponse, ApiNotFoundResponse, ApiConflictResponse} from "@nestjs/swagger";
import {CreateStoreDto} from "./dto/create-store.dto";
import {UpdateStoreDto} from "./dto/update-store.dto";
import {StoreResponseDto} from "./dto/store-response.dto";
import {PaginatedResponseDto} from "../common/dto/pagination.dto";
import {Authorized} from "../common/decorators/authorized.decorator";
import * as client from '../../prisma/generated/prisma/client';
import {Roles} from "../common/decorators/roles.decorator";
import {Authorization} from "../common/decorators/authorization.decorator";
import {RolesGuard} from "../common/guards/roles.guard";
import { Roles as UserRoles } from '../../prisma/generated/prisma/client';
import { JwtSwagger } from '../common/decorators/jwt-swagger.decorator';

@Controller('stores')
@ApiTags('Stores')
export class StoreController {
  constructor(private readonly storeService: StoreService) {}

  @ApiOperation({ summary: 'Get paginated stores with optional search' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({
    name: 'search',
    required: false,
    type: String,
    description: 'Search by name or address',
  })
  @ApiOkResponse({
    description: 'Returns paginated stores',
    type: PaginatedResponseDto,
  })
  @ApiBadRequestResponse({ description: 'Bad request' })
  @Get()
  async getAll(@Query() dto: PaginationDto, @Query('search') search?: string) {
    return await this.storeService.getAllStores(dto, search);
  }

  @ApiOperation({ summary: 'Get store by id' })
  @ApiOkResponse({
    description: 'Returns store by id',
    type: StoreResponseDto,
  })
  @ApiNotFoundResponse({ description: 'Store not found' })
  @Get(':id')
  async getOne(@Param('id', ParseIntPipe) id: number) {
    return await this.storeService.getStore(id)
  }

  @ApiOperation({ summary: 'Create new store' })
  @ApiOkResponse({
    description: 'Created successfully',
    type: StoreResponseDto,
  })
  @ApiBadRequestResponse({ description: 'Invalid fields' })
  @ApiUnauthorizedResponse({ description: 'User unauthorized' })
  @ApiForbiddenResponse({ description: 'Insufficient permissions' })
  @ApiConflictResponse({ description: 'Store already exists' })
  @JwtSwagger()
  @UseGuards(RolesGuard)
  @Authorization()
  @Roles(UserRoles.ADMIN)
  @Post()
  async create(@Authorized() user: client.User, @Body() data: CreateStoreDto) {
    return await this.storeService.createStore(data);
  }

  @ApiOperation({ summary: 'Update store by ID' })
  @ApiOkResponse({
    description: 'Updated successfully',
    type: StoreResponseDto,
  })
  @ApiBadRequestResponse({ description: 'Invalid data' })
  @ApiNotFoundResponse({ description: 'Store with id not found' })
  @ApiUnauthorizedResponse({ description: 'User unauthorized' })
  @ApiForbiddenResponse({ description: 'Insufficient permissions' })
  @ApiConflictResponse({ description: 'Store with email or address already exists' })
  @JwtSwagger()
  @UseGuards(RolesGuard)
  @Authorization()
  @Roles(UserRoles.ADMIN)
  @Put(':id')
  async update(
      @Authorized() user: client.User,
      @Param('id', ParseIntPipe) id: number,
      @Body() dto: UpdateStoreDto,
  ) {
    return await this.storeService.updateStore(id, dto);
  }

  @ApiOperation({ summary: 'Delete store by ID' })
  @ApiOkResponse({ description: 'Deleted successfully' })
  @ApiNotFoundResponse({ description: 'Store with id not found' })
  @ApiUnauthorizedResponse({ description: 'User unauthorized' })
  @ApiForbiddenResponse({ description: 'Insufficient permissions' })
  @JwtSwagger()
  @UseGuards(RolesGuard)
  @Authorization()
  @Roles(UserRoles.ADMIN)
  @Delete(':id')
  async delete(
      @Authorized() user: client.User,
      @Param('id', ParseIntPipe) id: number
  ) {
    return await this.storeService.removeStore(id)
  }
}