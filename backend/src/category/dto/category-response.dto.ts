import { ApiProperty } from '@nestjs/swagger';

export class CategoryResponseDto {
  @ApiProperty({ description: 'Category ID', example: 1 })
  id: number;

  @ApiProperty({ description: 'Category name', example: 'Phone' })
  name: string;

  @ApiProperty({
    description: 'Category description',
    example: 'Mobile gadgets',
    required: false,
  })
  description?: string;

  @ApiProperty({
    description: 'Image URL',
    example: 'https://example.com/image.png',
    required: false,
  })
  image_url?: string;

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
