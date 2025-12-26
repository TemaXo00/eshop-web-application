import {Body, Controller, Get, Post, Query, UseGuards} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiQuery,
  ApiOkResponse,
  ApiBadRequestResponse,
  ApiUnauthorizedResponse, ApiForbiddenResponse
} from '@nestjs/swagger';
import { CategoryService } from './category.service';
import {PaginatedResponseDto, PaginationDto} from "../common/dto/pagination.dto";
import {CategoryDto} from "./dto/category.dto";
import {Authorization} from "../common/decorators/authorization.decorator";
import {Authorized} from "../common/decorators/authorized.decorator";
import * as client from "../../prisma/generated/prisma/client";
import { Roles as UserRoles } from "../../prisma/generated/prisma/enums"
import {Roles} from "../common/decorators/roles.decorator";
import { RolesGuard } from "src/common/guards/roles.guard";
import {JwtSwagger} from "../common/decorators/jwt-swagger.decorator";

@ApiTags('Categories')
@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get()
  @ApiOperation({ summary: 'Get paginated categories' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiOkResponse({
    description: 'Returns paginated categories',
    type: PaginatedResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Bad request (ex. page=0',
  })
  findAll(@Query() paginationDto: PaginationDto) {
    return this.categoryService.findAllPaginated(paginationDto);
  }

  @ApiOperation({ summary: 'Create new category' })
  @ApiOkResponse({ description: 'Created successfully',type: CategoryDto })
  @ApiBadRequestResponse({description: 'Invalidate fields'})
  @ApiUnauthorizedResponse({description: 'User unauthorized and try to perform operation'})
  @ApiForbiddenResponse({description: 'Insufficient permissions'})
  @JwtSwagger()
  @UseGuards(RolesGuard)
  @Authorization()
  @Roles(UserRoles.ADMIN)
  @Post()
  create(@Authorized() user: client.User, @Body() dto: CategoryDto) {
    return this.categoryService.create(dto)
  }
}