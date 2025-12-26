import {Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Query, UseGuards} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiQuery,
  ApiOkResponse,
  ApiBadRequestResponse,
  ApiUnauthorizedResponse, ApiForbiddenResponse, ApiNotFoundResponse, ApiConflictResponse
} from '@nestjs/swagger';
import { CategoryService } from './category.service';
import {PaginatedResponseDto, PaginationDto} from "../common/dto/pagination.dto";
import {CreateCategoryDto} from "./dto/create-category.dto";
import {Authorization} from "../common/decorators/authorization.decorator";
import {Authorized} from "../common/decorators/authorized.decorator";
import * as client from "../../prisma/generated/prisma/client";
import { Roles as UserRoles } from "../../prisma/generated/prisma/enums"
import {Roles} from "../common/decorators/roles.decorator";
import { RolesGuard } from "src/common/guards/roles.guard";
import {JwtSwagger} from "../common/decorators/jwt-swagger.decorator";
import {UpdateCategoryDto} from "./dto/update-category.dto";
import {CategoryResponseDto} from "./dto/category-response.dto";

@ApiTags('Categories')
@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @ApiOperation({ summary: 'Get paginated categories' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiOkResponse({description: 'Returns paginated categories', type: PaginatedResponseDto,})
  @ApiBadRequestResponse({description: 'Bad request (ex. page=0'})
  @Get()
  async findAll(@Query() paginationDto: PaginationDto) {
    return await this.categoryService.findAllPaginated(paginationDto);
  }

  @ApiOperation({ summary: 'Get category by id' })
  @ApiOkResponse({description: 'Returns category by id', type: CategoryResponseDto})
  @ApiNotFoundResponse({description: 'Category not found'})
  @Get(':id')
  async findById(@Param('id', ParseIntPipe) id: number) {
    return await this.categoryService.findById(id);
  }

  @ApiOperation({ summary: 'Create new category' })
  @ApiOkResponse({ description: 'Created successfully',type: CreateCategoryDto })
  @ApiBadRequestResponse({description: 'Invalidate fields'})
  @ApiUnauthorizedResponse({description: 'User unauthorized and try to perform operation'})
  @ApiForbiddenResponse({description: 'Insufficient permissions'})
  @ApiConflictResponse({description: 'Category already exists'})
  @JwtSwagger()
  @UseGuards(RolesGuard)
  @Authorization()
  @Roles(UserRoles.ADMIN)
  @Post()
  async create(@Authorized() user: client.User, @Body() dto: CreateCategoryDto) {
    return await this.categoryService.create(dto)
  }

  @ApiOperation({ summary: 'Update category by ID' })
  @ApiOkResponse({ description: 'Updated successfully' })
  @ApiBadRequestResponse({ description: 'Invalid data' })
  @ApiNotFoundResponse({description: 'Category with id not found'})
  @ApiUnauthorizedResponse({ description: 'User unauthorized' })
  @ApiForbiddenResponse({ description: 'Insufficient permissions' })
  @JwtSwagger()
  @UseGuards(RolesGuard)
  @Authorization()
  @Roles(UserRoles.ADMIN)
  @Put(':id')
  async update(
      @Authorized() user: client.User,
      @Param('id', ParseIntPipe) id: number,
      @Body() dto: UpdateCategoryDto
  ) {
    return await this.categoryService.update(id, dto);
  }

  @ApiOperation({ summary: 'Delete category by ID' })
  @ApiOkResponse({ description: 'Deleted successfully' })
  @ApiNotFoundResponse({description: 'Category with id not found'})
  @ApiUnauthorizedResponse({ description: 'User unauthorized' })
  @ApiForbiddenResponse({ description: 'Insufficient permissions' })
  @JwtSwagger()
  @UseGuards(RolesGuard)
  @Authorization()
  @Roles(UserRoles.ADMIN)
  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id: number) {
    return await this.categoryService.delete(id);
  }
}