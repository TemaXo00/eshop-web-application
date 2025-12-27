import {Controller, Get, Param, ParseIntPipe, Query} from '@nestjs/common';
import { UserService } from './user.service';
import {
  ApiTags,
  ApiOperation,
  ApiQuery,
  ApiOkResponse,
  ApiBadRequestResponse,
  ApiNotFoundResponse, ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import {PaginatedResponseDto, PaginationDto} from '../common/dto/pagination.dto';
import { Roles } from '../../prisma/generated/prisma/enums';
import {ProfileDto} from "./dto/profile.dto";
import {JwtSwagger} from "../common/decorators/jwt-swagger.decorator";
import {Authorization} from "../common/decorators/authorization.decorator";
import {Authorized} from "../common/decorators/authorized.decorator";
import * as client from '../../prisma/generated/prisma/client';
import {AllUsersDto} from "./dto/all-users.dto";
import {UserByIdDto} from "./dto/user-by-id.dto";

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
  async profile(@Authorized() user: client.User) {
    return user;
  }
}
