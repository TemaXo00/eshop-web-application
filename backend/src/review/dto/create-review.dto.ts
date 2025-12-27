import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Length,
  Matches,
  Max,
  Min,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class CreateReviewDto {
  @ApiProperty({
    description: 'Product ID',
    example: 1,
    minimum: 1,
  })
  @IsNumber()
  @Min(1)
  @Transform(({ value }) => Number(value))
  productId: number;

  @ApiProperty({
    description: 'Review title',
    example: 'Excellent product!',
    minLength: 3,
    maxLength: 70,
  })
  @IsString()
  @IsNotEmpty()
  @Length(3, 70)
  title: string;

  @ApiProperty({
    description: 'Review description',
    example: 'This product exceeded my expectations',
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    description: 'What you liked',
    example: 'Great quality, fast delivery',
    required: false,
  })
  @IsOptional()
  @IsString()
  liked?: string;

  @ApiProperty({
    description: 'What you disliked',
    example: 'A bit expensive',
    required: false,
  })
  @IsOptional()
  @IsString()
  disliked?: string;

  @ApiProperty({
    description: 'Array of review image URLs',
    example: ['https://example.com/review1.jpg'],
    type: [String],
    required: false,
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @Matches(/^(https?:\/\/|\/|data:image\/)/, { each: true })
  images?: string[] = [];

  @ApiProperty({
    description: 'Rating (0.0 to 5.0)',
    example: 4.5,
    minimum: 0,
    maximum: 5,
  })
  @IsNumber()
  @Min(0)
  @Max(5)
  @Transform(({ value }) => Number(value))
  rating: number;
}
