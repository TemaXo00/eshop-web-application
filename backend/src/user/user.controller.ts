import { Controller, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import { UserService } from './user.service';
import {
  ApiTags,
  ApiOperation,
  ApiQuery,
  ApiOkResponse,
  ApiBadRequestResponse,
  ApiNotFoundResponse,
} from '@nestjs/swagger';
import { PaginationDto } from '../common/dto/pagination.dto';
import { Roles } from '../../prisma/generated/prisma/enums';

@ApiTags('Users')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({ summary: 'Get paginated users (public)' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({
    name: 'search',
    required: false,
    type: String,
    description: 'Search by username, first name, last name',
  })
  @ApiQuery({
    name: 'role',
    enum: Roles,
    required: false,
    description: 'Filter by role',
  })
  @ApiOkResponse({ description: 'Returns paginated users' })
  @ApiBadRequestResponse({ description: 'Invalid pagination parameters' })
  @Get('')
  async getAllUsers(
    @Query() dto: PaginationDto,
    @Query('search') search?: string,
    @Query('role') role?: Roles,
  ) {
    return await this.userService.getAllUsers(dto, search, role);
  }

  @ApiOperation({ summary: 'Get user profile by ID' })
  @ApiOkResponse({ description: 'Returns user profile' })
  @ApiNotFoundResponse({ description: 'User not found' })
  @Get(':id')
  async getUser(@Param('id', ParseIntPipe) id: number) {
    return await this.userService.getUserById(id);
  }

  @ApiOperation({ summary: 'Get available enums for user management' })
  @ApiOkResponse({
    description: 'Returns available roles and statuses',
    schema: {
      example: {
        roles: ['USER', 'EMPLOYEE', 'ADMIN', 'SUPPLIERMANAGER'],
        storePositions: [
          'SELLER',
          'MANAGER',
          'ADMINISTRATOR',
          'DIRECTOR',
          'CONSULTANT',
        ],
        statuses: ['ACTIVE', 'BANNED'],
      },
    },
  })
  @Get('enums/available')
  async getAvailableEnums() {
    return await this.userService.getAvailableEnums();
  }
}
