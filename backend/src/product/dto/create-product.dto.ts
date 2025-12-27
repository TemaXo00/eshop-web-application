import {
  ArrayMinSize,
  IsArray,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  Length,
  Matches,
  Max,
  Min,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProductDto {
  @ApiProperty({
    description: 'Name of the product',
    example: 'iPhone 15 Pro Max',
    minLength: 3,
    maxLength: 50,
  })
  @IsNotEmpty()
  @IsString()
  @Length(3, 50)
  name: string;

  @ApiProperty({
    description: 'Description of the product',
    example:
      'Latest iPhone with A17 Pro chip, titanium design, and 48MP camera',
    required: false,
    maxLength: 1000,
  })
  @IsOptional()
  @IsString()
  @Length(0, 1000)
  description?: string;

  @ApiProperty({
    description: 'Price of the product in currency units',
    example: 1299,
    minimum: 1,
    maximum: 999999,
  })
  @IsNumber()
  @IsInt()
  @IsPositive()
  @Min(1)
  @Max(999999)
  @Transform(({ value }) => Number(value))
  price: number;

  @ApiProperty({
    description: 'Array of product image URLs',
    example: [
      'https://example.com/iphone15-front.jpg',
      'https://example.com/iphone15-back.jpg',
      'https://example.com/iphone15-side.jpg',
    ],
    type: [String],
    minItems: 1,
  })
  @IsArray()
  @ArrayMinSize(1)
  @IsString({ each: true })
  @Matches(/^(https?:\/\/|\/|data:image\/)/, { each: true })
  images: string[];

  @ApiProperty({
    description: 'Array of category IDs for this product',
    example: [1, 3],
    type: [Number],
    required: false,
  })
  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  @IsPositive({ each: true })
  @Type(() => Number)
  @Transform(({ value }) => {
    if (!value) return [];
    if (Array.isArray(value)) {
      return value.map((v) => Number(v));
    }
    if (typeof value === 'string') {
      return value.split(',').map((v) => Number(v.trim()));
    }
    return [];
  })
  categoryIds?: number[] = [];
}
