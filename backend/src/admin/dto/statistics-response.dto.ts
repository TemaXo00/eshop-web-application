import { ApiProperty } from '@nestjs/swagger';

export class StatisticsResponseDto {
  @ApiProperty({
    description: "User's count",
    example: 1,
  })
  users: number;
  @ApiProperty({
    description: 'Products count',
    example: 1,
  })
  products: number;
  @ApiProperty({
    description: 'Stores count',
    example: 1,
  })
  stores: number;
  @ApiProperty({
    description: 'Reviews count',
    example: 1,
  })
  reviews: number;
  @ApiProperty({
    description: 'Sales count',
    example: 1,
  })
  sales: number;
}
