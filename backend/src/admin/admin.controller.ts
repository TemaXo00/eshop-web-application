import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Query,
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
  ApiTags,
} from '@nestjs/swagger';
import * as client from '../../prisma/generated/prisma/client';
import { Authorized } from '../common/decorators/authorized.decorator';
import { AdminOnly } from '../common/decorators/admin-only.decorator';
import { JwtSwagger } from '../common/decorators/jwt-swagger.decorator';
import { Roles } from '../../prisma/generated/prisma/enums';
import { StatisticsResponseDto } from './dto/statistics-response.dto';

@ApiTags('Admin panel')
@AdminOnly()
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
  @ApiQuery({
    name: 'role',
    enum: Roles,
    required: true,
  })
  @Patch('roles/:id')
  async changeRole(
      @Param('id', ParseIntPipe) id: number,
      @Query('role') role: Roles,
  ) {
    return this.adminService.changeRole(id, role);
  }
}