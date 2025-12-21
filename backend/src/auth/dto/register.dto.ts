import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsStrongPassword,
  Length,
  Matches,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({
    description: 'User first name',
    example: 'Michael',
    minLength: 3,
    maxLength: 30,
  })
  @IsNotEmpty()
  @IsString()
  @Length(3, 30)
  first_name: string;
  @ApiProperty({
    description: 'User last name',
    example: 'Kelly',
    minLength: 3,
    maxLength: 30,
    required: false,
  })
  @IsOptional()
  @IsString()
  @Length(3, 30)
  last_name?: string;
  @ApiProperty({
    description:
      'User password. Requires minimal 8 characters long, 1 lowercase, 1 uppercase, 1 symbol, 1 number',
    example: 'Aa$1bcde',
    minLength: 8,
  })
  @IsNotEmpty()
  @IsString()
  @IsStrongPassword({
    minLength: 8,
    minLowercase: 1,
    minUppercase: 1,
    minNumbers: 1,
    minSymbols: 1,
  })
  password: string;
  @ApiProperty({
    description:
      'Username of current user. If user enter it, username must be unique ',
    example: 'MichaelKelly123',
    minLength: 3,
    maxLength: 30,
    required: false,
  })
  @IsOptional()
  @IsString()
  @Length(3, 30)
  username?: string;
  @ApiProperty({
    description: 'URL to avatar (link, file, etc.)',
    example: 'https://avatar.im',
    required: false,
  })
  @IsOptional()
  @IsString()
  @Matches(/^(https?:\/\/|\/|data:image\/)/)
  avatar_url?: string;
  @ApiProperty({
    description: 'User phone number. Validate by regular expression',
    example: '+375291234567',
    required: false,
    minLength: 10,
    maxLength: 20,
  })
  @IsNotEmpty()
  @Matches(/^\+?\d{10,19}$/, {
    message: 'Phone must contain only digits with optional + prefix',
  })
  @IsString()
  phone: string;
  @ApiProperty({
    description: "User's email",
    example: 'example@example.com',
    minLength: 3,
    maxLength: 60,
  })
  @IsNotEmpty()
  @IsEmail()
  @IsString()
  @Length(3, 60)
  email: string;
}