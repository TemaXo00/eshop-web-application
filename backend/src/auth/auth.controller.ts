import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

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
    //ToDo Create example
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
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }
}
