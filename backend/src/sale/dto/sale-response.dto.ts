import { ApiProperty } from '@nestjs/swagger';
import { PaymentMethods, PaymentStatus } from '../../../prisma/generated/prisma/enums';

class ClientInfoDto {
    @ApiProperty({ description: 'Client ID', example: 10 })
    id: number;

    @ApiProperty({ description: 'Client first name', example: 'John' })
    first_name: string;

    @ApiProperty({ description: 'Client last name', example: 'Doe' })
    last_name: string;

    @ApiProperty({ description: 'Client phone', example: '+1234567890' })
    phone: string;

    @ApiProperty({ description: 'Client email', example: 'john@example.com' })
    email: string;
}

class SellerInfoDto {
    @ApiProperty({ description: 'Seller ID', example: 5 })
    id: number;

    @ApiProperty({ description: 'Seller first name', example: 'Jane' })
    first_name: string;

    @ApiProperty({ description: 'Seller last name', example: 'Smith' })
    last_name: string;

    @ApiProperty({ description: 'Seller phone', example: '+9876543210' })
    phone: string;

    @ApiProperty({ description: 'Seller email', example: 'jane@example.com' })
    email: string;
}

class StoreInfoDto {
    @ApiProperty({ description: 'Store ID', example: 3 })
    id: number;

    @ApiProperty({ description: 'Store name', example: 'Tech Store' })
    name: string;

    @ApiProperty({ description: 'Store address', example: '123 Main St' })
    address: string;
}

class ProductInfoDto {
    @ApiProperty({ description: 'Product ID', example: 1 })
    id: number;

    @ApiProperty({ description: 'Product name', example: 'iPhone 15 Pro Max' })
    name: string;

    @ApiProperty({ description: 'Product price', example: 1299 })
    price: number;
}

class SaleItemResponseDto {
    @ApiProperty({ description: 'Sale item ID', example: 1 })
    id: number;

    @ApiProperty({ description: 'Product', type: ProductInfoDto })
    product: ProductInfoDto;

    @ApiProperty({ description: 'Quantity', example: 2 })
    quantity: number;

    @ApiProperty({ description: 'Price at sale', example: 1299 })
    price_at_sale: number;
}

export class SaleResponseDto {
    @ApiProperty({ description: 'Sale ID', example: 1 })
    id: number;

    @ApiProperty({ description: 'Client information', type: ClientInfoDto })
    client: ClientInfoDto;

    @ApiProperty({ description: 'Seller information', type: SellerInfoDto })
    seller: SellerInfoDto;

    @ApiProperty({ description: 'Store information', type: StoreInfoDto })
    store: StoreInfoDto;

    @ApiProperty({ description: 'Total amount', example: 2598.00 })
    total_amount: number;

    @ApiProperty({
        description: 'Payment method',
        enum: PaymentMethods,
        example: PaymentMethods.CARD
    })
    payment_method: PaymentMethods;

    @ApiProperty({
        description: 'Payment status',
        enum: PaymentStatus,
        example: PaymentStatus.OK
    })
    payment_status: PaymentStatus;

    @ApiProperty({
        description: 'Sale items',
        type: [SaleItemResponseDto]
    })
    sale_items: SaleItemResponseDto[];

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