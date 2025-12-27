import { ApiProperty } from '@nestjs/swagger';

class UserInfoDto {
  @ApiProperty({ description: 'User ID', example: 1 })
  id: number;

  @ApiProperty({ description: 'User first name', example: 'John' })
  first_name: string;

  @ApiProperty({ description: 'User last name', example: 'Doe' })
  last_name: string;

  @ApiProperty({
    description: 'User avatar URL',
    example: 'https://example.com/avatar.jpg',
    required: false,
  })
  avatar_url?: string;
}

class ProductInfoDto {
  @ApiProperty({ description: 'Product ID', example: 1 })
  id: number;

  @ApiProperty({ description: 'Product name', example: 'iPhone 15 Pro Max' })
  name: string;
}

export class ReviewResponseDto {
  @ApiProperty({ description: 'Review ID', example: 1 })
  id: number;

  @ApiProperty({ description: 'Review title', example: 'Excellent product!' })
  title: string;

  @ApiProperty({
    description: 'Review description',
    example: 'This product exceeded my expectations',
    required: false,
  })
  description?: string;

  @ApiProperty({
    description: 'What you liked',
    example: 'Great quality, fast delivery',
    required: false,
  })
  liked?: string;

  @ApiProperty({
    description: 'What you disliked',
    example: 'A bit expensive',
    required: false,
  })
  disliked?: string;

  @ApiProperty({
    description: 'Review images',
    example: ['https://example.com/review1.jpg'],
    type: [String],
  })
  images: string[];

  @ApiProperty({ description: 'Rating', example: 4.5 })
  rating: number;

  @ApiProperty({ description: 'User information', type: UserInfoDto })
  user: UserInfoDto;

  @ApiProperty({ description: 'Product information', type: ProductInfoDto })
  product: ProductInfoDto;

  @ApiProperty({
    description: 'Created at',
    example: '2024-01-01T00:00:00.000Z',
  })
  created_at: Date;

  @ApiProperty({
    description: 'Updated at',
    example: '2024-01-01T00:00:00.000Z',
  })
  updated_at: Date;
}
