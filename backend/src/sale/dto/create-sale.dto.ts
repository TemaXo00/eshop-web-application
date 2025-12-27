import {
  ArrayMinSize,
  IsArray,
  IsEnum,
  IsInt,
  IsPositive,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import {
  PaymentMethods,
  PaymentStatus,
} from '../../../prisma/generated/prisma/enums';

class SaleItemDto {
  @ApiProperty({
    description: 'Product ID',
    example: 1,
    minimum: 1,
  })
  @IsInt()
  @IsPositive()
  productId: number;

  @ApiProperty({
    description: 'Quantity of the product',
    example: 2,
    minimum: 1,
  })
  @IsInt()
  @Min(1)
  quantity: number;
}

export class CreateSaleDto {
  @ApiProperty({
    description: 'Client ID',
    example: 10,
    minimum: 1,
  })
  @IsInt()
  @IsPositive()
  clientId: number;

  @ApiProperty({
    description: 'Store ID',
    example: 5,
    minimum: 1,
  })
  @IsInt()
  @IsPositive()
  storeId: number;

  @ApiProperty({
    description: 'Payment method',
    enum: PaymentMethods,
    example: PaymentMethods.CARD,
  })
  @IsEnum(PaymentMethods)
  paymentMethod: PaymentMethods;

  @ApiProperty({
    description: 'Payment status',
    enum: PaymentStatus,
    example: PaymentStatus.OK,
    required: false,
    default: PaymentStatus.OK,
  })
  @IsEnum(PaymentStatus)
  paymentStatus: PaymentStatus = PaymentStatus.OK;

  @ApiProperty({
    description: 'Array of sale items',
    type: [SaleItemDto],
    minItems: 1,
  })
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => SaleItemDto)
  items: SaleItemDto[];
}
