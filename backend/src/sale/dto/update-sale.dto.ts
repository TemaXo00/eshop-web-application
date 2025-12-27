import { IsEnum, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { PaymentStatus } from '../../../prisma/generated/prisma/enums';

export class UpdateSaleDto {
    @ApiProperty({
        description: 'Payment status',
        enum: PaymentStatus,
        example: PaymentStatus.REFUND,
        required: false,
    })
    @IsOptional()
    @IsEnum(PaymentStatus)
    paymentStatus?: PaymentStatus;
}