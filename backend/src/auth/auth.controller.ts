import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Req,
  Res,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { LoginDto } from './dto/login.dto';
import type { Request, Response } from 'express';
import { AuthDto } from './dto/auth.dto';
import { Authorization } from '../common/decorators/authorization.decorator';
import { Authorized } from '../common/decorators/authorized.decorator';
import * as client from '../../prisma/generated/prisma/client';
import { UserDto } from './dto/user.dto';
import { JwtSwagger } from '../common/decorators/jwt-swagger.decorator';

@ApiTags('Authorization')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({
    summary: 'Registration',
    description: 'Register a new user',
  })
  @ApiCreatedResponse({
    description: 'Register a new user successfully',
    type: AuthDto,
  })
  @ApiConflictResponse({
    description: 'User with this email already exists',
  })
  @ApiBadRequestResponse({
    description: "One or many fields doesn't correct",
  })
  @Post('register')
  @HttpCode(201)
  register(
    @Res({ passthrough: true }) res: Response,
    @Body() dto: RegisterDto,
  ) {
    return this.authService.register(res, dto);
  }

  @ApiOperation({
    summary: 'Login',
    description: 'Login into existing account',
  })
  @ApiOkResponse({
    description: 'Login successfully',
    type: AuthDto,
  })
  @ApiNotFoundResponse({
    description: 'User not found',
  })
  @ApiBadRequestResponse({
    description: 'Login data is not correct',
  })
  @ApiUnauthorizedResponse({
    description: 'User banned',
  })
  @Post('login')
  @HttpCode(200)
  login(@Res({ passthrough: true }) res: Response, @Body() dto: LoginDto) {
    return this.authService.login(res, dto);
  }

  @ApiOperation({
    summary: 'Refresh Token',
    description: 'Refresh access token via refresh token',
  })
  @ApiOkResponse({
    description: 'Refresh successfully',
    type: AuthDto,
  })
  @ApiNotFoundResponse({
    description: 'User not found',
  })
  @ApiUnauthorizedResponse({
    description: 'Could not found refresh token or user banned',
  })
  @JwtSwagger()
  @Post('refresh')
  @HttpCode(200)
  async refresh(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    return await this.authService.refresh(req, res);
  }

  @ApiOperation({
    summary: 'Logout',
    description: 'Logout from account',
  })
  @ApiNoContentResponse({
    description: 'Logout successfully',
  })
  @JwtSwagger()
  @Post('logout')
  @HttpCode(204)
  async logout(@Res({ passthrough: true }) res: Response) {
    return await this.authService.logout(res);
  }

  @ApiOperation({
    summary: 'Get current user',
    description: 'Returns profile information of the authenticated user',
  })
  @ApiOkResponse({
    description: 'Show user',
    type: UserDto,
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized',
  })
  @JwtSwagger()
  @Authorization()
  @Get('profile')
  @HttpCode(200)
  async user(@Authorized() user: client.User) {
    return user;
  }
}
