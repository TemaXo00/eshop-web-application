import { Transform } from 'class-transformer';
import {
  IsEmail,
  IsOptional,
  IsString,
  Length,
  Matches,
  Max,
  Min,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateSupplierDto {
  @ApiProperty({
    description: 'Name of the supplier',
    example: 'TechCorp Inc.',
    minLength: 3,
    maxLength: 50,
    required: false,
  })
  @IsOptional()
  @IsString()
  @Length(3, 50)
  name?: string;

  @ApiProperty({
    description: 'Phone number of the supplier',
    example: '+1234567890',
    minLength: 3,
    maxLength: 20,
    required: false,
  })
  @IsOptional()
  @IsString()
  @Length(3, 20)
  phone?: string;

  @ApiProperty({
    description: 'Email of the supplier',
    example: 'contact@techcorp.com',
    minLength: 3,
    maxLength: 60,
    required: false,
  })
  @IsOptional()
  @IsString()
  @IsEmail()
  @Length(3, 60)
  email?: string;

  @ApiProperty({
    description: 'Rating of the supplier (0.0 to 5.0)',
    example: 4.2,
    minimum: 0,
    maximum: 5,
    required: false,
  })
  @IsOptional()
  @Transform(({ value }) => Number(value))
  @Min(0)
  @Max(5)
  rating?: number;

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
