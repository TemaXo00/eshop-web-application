import { ApiProperty } from '@nestjs/swagger';

export class StoreResponseDto {
  @ApiProperty({ description: 'Store ID', example: 1 })
  id: number;

  @ApiProperty({ description: 'Store name', example: 'Fresh Market' })
  name: string;

  @ApiProperty({
    description: 'Store address',
    example: '123 Main Street, New York, NY 10001',
  })
  address: string;

  @ApiProperty({ description: 'Store email', example: 'info@freshmarket.com' })
  email: string;

  @ApiProperty({
    description: 'Store image URL',
    example: 'https://example.com/store-image.jpg',
    required: false,
  })
  store_image?: string;

  @ApiProperty({ description: 'Opening time', example: '09:00:00' })
  opening_time: Date;

  @ApiProperty({ description: 'Closing time', example: '21:00:00' })
  closing_time: Date;

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
