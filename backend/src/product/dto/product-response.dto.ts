import { ApiProperty } from '@nestjs/swagger';

export class ProductResponseDto {
    @ApiProperty({ description: 'Product ID', example: 1 })
    id: number;

    @ApiProperty({ description: 'Product name', example: 'iPhone 15 Pro Max' })
    name: string;

    @ApiProperty({
        description: 'Product description',
        example: 'Latest iPhone with A17 Pro chip, titanium design, and 48MP camera',
        required: false,
    })
    description?: string;

    @ApiProperty({ description: 'Product price', example: 1299 })
    price: number;

    @ApiProperty({ description: 'Product rating', example: 4.5 })
    rating: number;

    @ApiProperty({
        description: 'Product images',
        example: ['https://example.com/iphone15-front.jpg'],
        type: [String],
    })
    images: string[];

    @ApiProperty({
        description: 'Created at',
        example: '2024-01-01T00:00:00.000Z'
    })
    created_at: Date;

    @ApiProperty({
        description: 'Updated at',
        example: '2024-01-01T00:00:00.000Z'
    })
    updated_at: Date;
}