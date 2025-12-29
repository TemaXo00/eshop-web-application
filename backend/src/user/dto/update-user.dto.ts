import {
  IsString,
  IsOptional,
  IsEmail,
  MinLength,
  MaxLength,
  Matches,
  IsStrongPassword, ValidateIf,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDto {
  @ApiProperty({
    description: 'User first name',
    example: 'Michael',
    minLength: 3,
    maxLength: 30,
    required: false,
  })
  @IsOptional()
  @IsString()
  @MinLength(3)
  @MaxLength(30)
  first_name?: string;

  @ApiProperty({
    description: 'User last name',
    example: 'Kelly',
    minLength: 3,
    maxLength: 30,
    required: false,
  })
  @IsOptional()
  @IsString()
  @MinLength(3)
  @MaxLength(30)
  last_name?: string;

  @ApiProperty({
    description:
      'User password. Requires minimal 8 characters long, 1 lowercase, 1 uppercase, 1 symbol, 1 number',
    example: 'Aa$1bcde',
    minLength: 8,
    required: false,
  })
  @IsOptional()
  @IsString()
  @IsStrongPassword({
    minLength: 8,
    minLowercase: 1,
    minUppercase: 1,
    minNumbers: 1,
    minSymbols: 1,
  })
  password?: string;

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
  @MinLength(3)
  @MaxLength(30)
  username?: string;

  @ApiProperty({
    description: 'URL to avatar (link, file, etc.)',
    example: 'https://avatar.im',
    required: false,
  })
  @IsOptional()
  @IsString()
  @ValidateIf(o => o.avatar_url && o.avatar_url.length > 0)
  @Matches(/^(https?:\/\/|\/|data:image\/)/)
  avatar_url?: string;

  @ApiProperty({
    description: 'User phone number. Validate by regular expression',
    example: '+375291234567',
    minLength: 10,
    maxLength: 20,
    required: false,
  })
  @IsOptional()
  @IsString()
  @Matches(/^\+?\d{10,19}$/, {
    message: 'Phone must contain only digits with optional + prefix',
  })
  phone?: string;

  @ApiProperty({
    description: "User's email",
    example: 'example@example.com',
    minLength: 3,
    maxLength: 60,
    required: false,
  })
  @IsOptional()
  @IsString()
  @IsEmail()
  @MinLength(3)
  @MaxLength(60)
  email?: string;
}
