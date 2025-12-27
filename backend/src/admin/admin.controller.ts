import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Query, UseGuards,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags, ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import * as client from '../../prisma/generated/prisma/client';
import { Authorized } from '../common/decorators/authorized.decorator';
import { JwtSwagger } from '../common/decorators/jwt-swagger.decorator';
import { StatisticsResponseDto } from './dto/statistics-response.dto';
import {RolesGuard} from "../common/guards/roles.guard";
import {Authorization} from "../common/decorators/authorization.decorator";
import {Roles as UserRoles} from "../../prisma/generated/prisma/client";
import {Roles} from "../common/decorators/roles.decorator";

@ApiTags('Admin panel')
@JwtSwagger()
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @ApiOperation({
    summary: 'General stats',
    description: 'Get general statistics about users, ',
  })
  @ApiOkResponse({
    description: 'Successfully retrieved statistics',
    type: StatisticsResponseDto,
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized',
  })
  @UseGuards(RolesGuard)
  @Authorization()
  @Roles(UserRoles.ADMIN)
  @Get('statistics')
  async getStats(@Authorized() user: client.User) {
    return await this.adminService.generalStatistics();
  }

  @ApiOperation({
    summary: 'Ban',
    description: 'Soft ban existing user',
  })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'User ID to ban',
  })
  @ApiOkResponse({
    description: 'Successfully ban existing user',
    example: {
      id: 1,
      status: 'BANNED',
      message: `User successfully banned`,
    },
  })
  @ApiNotFoundResponse({
    description: 'User not found',
  })
  @ApiConflictResponse({
    description: 'User is admin/already banned',
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized',
  })
  @UseGuards(RolesGuard)
  @Authorization()
  @Roles(UserRoles.ADMIN)
  @Patch('ban/:id')
  async banUser(@Param('id', ParseIntPipe) id: number) {
    return await this.adminService.banUser(id);
  }

  @ApiOperation({
    summary: 'Restore',
    description: 'Restore user',
  })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'User ID to restore',
  })
  @ApiOkResponse({
    description: 'Successfully restore',
    example: {
      id: 1,
      status: 'ACTIVE',
      message: `User successfully restored`,
    },
  })
  @ApiNotFoundResponse({
    description: 'User not found',
  })
  @ApiConflictResponse({
    description: 'User is already active',
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized',
  })
  @UseGuards(RolesGuard)
  @Authorization()
  @Roles(UserRoles.ADMIN)
  @Patch('restore/:id')
  async restoreUser(@Param('id', ParseIntPipe) id: number) {
    return await this.adminService.restoreUser(id);
  }

  @ApiOperation({
    summary: 'Update user role',
    description: 'Change user role',
  })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'User ID to change role',
  })
  @ApiOkResponse({
    description: 'Successfully update role',
    schema: {
      example: {
        id: 1,
        role: 'EMPLOYEE',
        message: 'User role successfully changed to EMPLOYEE',
      },
    },
  })
  @ApiBadRequestResponse({
    description: 'Missing required parameters for role',
  })
  @ApiNotFoundResponse({
    description: 'User not found',
  })
  @ApiConflictResponse({
    description: 'User have this role/banned/admin',
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized',
  })
  @ApiQuery({
    name: 'role',
    enum: UserRoles,
    required: true,
  })
  @UseGuards(RolesGuard)
  @Authorization()
  @Roles(UserRoles.ADMIN)
  @Patch('roles/:id')
  async changeRole(
    @Param('id', ParseIntPipe) id: number,
    @Query('role') role: UserRoles,
  ) {
    return this.adminService.changeRole(id, role);
  }
}
