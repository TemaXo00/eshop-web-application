import {Controller, Get, Param, ParseIntPipe, Query, Delete, Res, Put, Body} from '@nestjs/common';
import { UserService } from './user.service';
import {
  ApiTags,
  ApiOperation,
  ApiQuery,
  ApiOkResponse,
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiUnauthorizedResponse, ApiConflictResponse,
} from '@nestjs/swagger';
import { PaginatedResponseDto, PaginationDto } from '../common/dto/pagination.dto';
import { Roles } from '../../prisma/generated/prisma/enums';
import { ProfileDto } from "./dto/profile.dto";
import { JwtSwagger } from "../common/decorators/jwt-swagger.decorator";
import { Authorization } from "../common/decorators/authorization.decorator";
import { Authorized } from "../common/decorators/authorized.decorator";
import type { User as PrismaUser } from '../../prisma/generated/prisma/client';
import type { Response } from 'express';
import { AllUsersDto } from "./dto/all-users.dto";
import { UserByIdDto } from "./dto/user-by-id.dto";
import {UpdateUserDto} from "./dto/update-user.dto";

@ApiTags('Users')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({ summary: 'Get paginated users' })
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
  @ApiOkResponse({ description: 'Returns paginated users', type: PaginatedResponseDto<AllUsersDto> })
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
  @ApiOkResponse({ description: 'Returns user profile', type: UserByIdDto })
  @ApiNotFoundResponse({ description: 'User not found' })
  @Get('profile/:id')
  async getUser(@Param('id', ParseIntPipe) id: number) {
    return await this.userService.getUserById(id);
  }

  @ApiOperation({
    summary: 'Get current user',
    description: 'Returns profile information of the authenticated user',
  })
  @ApiOkResponse({
    description: 'Show user',
    type: ProfileDto,
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized',
  })
  @JwtSwagger()
  @Authorization()
  @Get('me')
  async profile(@Authorized() user: PrismaUser) {
    return user;
  }

  @ApiOperation({ summary: 'Update user data', description: 'Update all user data' })
  @ApiOkResponse({ description: 'Update user data successfully', type: UpdateUserDto })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiBadRequestResponse({ description: 'Bad data' })
  @ApiConflictResponse({ description: 'Conflict of data' })
  @JwtSwagger()
  @Authorization()
  @Put('me')
  async update(@Authorized() user: PrismaUser, @Body() dto: UpdateUserDto) {
    return await this.userService.updateUser(user.id, dto)
  }

  @ApiOperation({
    summary: 'Delete my account',
    description: 'Soft delete current user account and logout',
  })
  @ApiOkResponse({
    description: 'Account successfully deleted',
    schema: {
      example: {
        id: 1,
        status: 'DELETED',
        message: 'User account successfully deleted',
      },
    },
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized',
  })
  @JwtSwagger()
  @Authorization()
  @Delete('me')
  async deleteAccount(
      @Authorized() user: PrismaUser,
      @Res({ passthrough: true }) res: Response,
  ) {
    return await this.userService.deleteUser(user.id, res);
  }
}