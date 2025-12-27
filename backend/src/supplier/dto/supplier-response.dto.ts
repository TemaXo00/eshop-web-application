import { ApiProperty } from '@nestjs/swagger';

export class SupplierResponseDto {
  @ApiProperty({ description: 'Supplier ID', example: 1 })
  id: number;

  @ApiProperty({ description: 'Supplier name', example: 'TechCorp Inc.' })
  name: string;

  @ApiProperty({ description: 'Supplier phone', example: '+1234567890' })
  phone: string;

  @ApiProperty({
    description: 'Supplier email',
    example: 'contact@techcorp.com',
  })
  email: string;

  @ApiProperty({ description: 'Supplier rating', example: 4.2 })
  rating: number;

  @ApiProperty({
    description: 'Supplier logo URL',
    example: 'https://example.com/logo.jpg',
    required: false,
  })
  logo_url?: string;

  @ApiProperty({
    description: 'Manager ID',
    example: 5,
    required: false,
  })
  manager_id?: number;

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
