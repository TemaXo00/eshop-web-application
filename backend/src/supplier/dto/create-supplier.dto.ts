import { Transform } from 'class-transformer';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
  Matches,
  Max,
  Min,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateSupplierDto {
  @ApiProperty({
    description: 'Name of the supplier',
    example: 'TechCorp Inc.',
    minLength: 3,
    maxLength: 50,
  })
  @IsString()
  @IsNotEmpty()
  @Length(3, 50)
  name: string;

  @ApiProperty({
    description: 'Phone number of the supplier',
    example: '+1234567890',
    minLength: 3,
    maxLength: 20,
  })
  @IsString()
  @IsNotEmpty()
  @Length(3, 20)
  phone: string;

  @ApiProperty({
    description: 'Email of the supplier',
    example: 'contact@techcorp.com',
    minLength: 3,
    maxLength: 60,
  })
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  @Length(3, 60)
  email: string;

  @ApiProperty({
    description: 'Initial rating of the supplier (0.0 to 5.0)',
    example: 4.2,
    minimum: 0,
    maximum: 5,
    required: false,
    default: 0.0,
  })
  @IsOptional()
  @Transform(({ value }) => (value !== undefined ? Number(value) : 0.0))
  @Min(0)
  @Max(10)
  rating?: number = 0.0;

  @ApiProperty({
    description: 'URL to supplier logo',
    example: 'https://example.com/logo.jpg',
    required: false,
  })
  @IsOptional()
  @IsString()
  @Matches(/^(https?:\/\/|\/|data:image\/)/)
  logo_url?: string;
}
