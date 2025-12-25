import {Body, Controller, Get, HttpCode, Post, Req, Res, UseGuards} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import {
  ApiBadRequestResponse, ApiBearerAuth,
  ApiConflictResponse,
  ApiCreatedResponse, ApiNoContentResponse, ApiNotFoundResponse, ApiOkResponse,
  ApiOperation,
  ApiTags, ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import {LoginDto} from "./dto/login.dto";
import type { Request, Response } from 'express';
import {AuthDto} from "./dto/auth.dto";
import {AuthGuard} from "@nestjs/passport";
import {Authorization} from "../common/decorators/authorization.decorator";
import {Authorized} from "../common/decorators/authorized.decorator";
import * as client from "../prisma/generated/prisma/client";

@ApiTags('Authorization')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {
  }

  @ApiOperation({
    summary: 'Registration',
    description: 'Register a new user',
  })
  @ApiCreatedResponse({
    description: 'Register a new user successfully',
    type: AuthDto
  })
  @ApiConflictResponse({
    description: 'One or many fields exists',
    example: {
      message: 'User with this email already exists',
      error: 'Conflict',
      statusCode: 409,
    },
  })
  @ApiBadRequestResponse({
    description: "Error registering user. One or many fields doesn't correct",
    example: {
      message: [
        'phone must be a string',
        'Phone must contain only digits with optional + prefix',
        'phone should not be empty',
        'email must be longer than or equal to 3 characters',
        'email must be a string',
        'email must be an email',
        'email should not be empty',
      ],
      error: 'Bad Request',
      statusCode: 400,
    },
  })
  @Post('register')
  @HttpCode(201)
  register(@Res({passthrough: true}) res: Response, @Body() dto: RegisterDto) {
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
    description: 'Login not found',
    example: {
      "message": "User not found",
      "error": "Not found",
      "statusCode": 404
    }
  })
  @ApiBadRequestResponse({
    description: 'Login data is not correct',
    example: {
      "message": [
        "email must be an email"
      ],
      "error": "Bad Request",
      "statusCode": 400
    }
  })
  @Post('login')
  @HttpCode(200)
  login(@Res({passthrough: true}) res: Response, @Body() dto: LoginDto) {
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
    example: {
      "message": "User not found",
      "error": "Not found",
      "statusCode": 404
    }
  })
  @ApiUnauthorizedResponse({
    description: 'Refresh token not found',
    example: {
      message: 'Could not found refresh token',
      error: 'Unauthorized',
      statusCode: 401,
    }
  })
  @Post('refresh')
  @HttpCode(200)
  async refresh(@Req() req: Request, @Res({passthrough: true}) res: Response) {
    return await this.authService.refresh(req, res)
  }

  @ApiOperation({
    summary: 'Logout',
    description: 'Logout from account',
  })
  @ApiNoContentResponse({
    description: 'Logout successfully',
  })
  @Post('logout')
  @HttpCode(204)
  async logout(@Res({passthrough: true}) res: Response) {
    return await this.authService.logout(res)
  }

  @ApiOperation({
    summary: 'Get current user profile',
    description: 'Returns profile information of the authenticated user',
  })
  @ApiBearerAuth('JWT-auth')
  @ApiOkResponse({
    description: 'Show user profile',
    example: {
      id: 1,
      first_name: 'John',
      last_name: 'Doe',
      email: 'john.doe@example.com',
      phone: '+1234567890',
      username: 'johndoe',
      avatar_url: 'https://example.com/avatar.jpg',
      role: 'USER',
      created_at: '2024-01-01T00:00:00.000Z',
      updated_at: '2024-01-01T00:00:00.000Z',
    }
  })
  @ApiUnauthorizedResponse({
    description: 'User unauthorized',
    example: {
      message: 'Unauthorized',
      statusCode: 401,
    }
  })
  @Authorization()
  @Get('profile')
  @HttpCode(200)
  async myProfile(@Authorized() user: client.User) {
    return user;
  }
}
